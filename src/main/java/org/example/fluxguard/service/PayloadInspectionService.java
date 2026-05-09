package org.example.fluxguard.service;

import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Inspects query strings and path parameters for:
 *  - SQL injection patterns
 *  - XSS / script injection
 *  - Path traversal attempts
 *  - Command injection attempts
 */
@Service
public class PayloadInspectionService {

    // Map of label -> compiled pattern (ordered: cheapest checks first)
    private static final Map<String, Pattern> PATTERNS = new LinkedHashMap<>();

    static {
        // Path traversal
        PATTERNS.put("Path traversal",
                Pattern.compile("\\.\\./|\\.\\./|%2e%2e%2f|%252e%252e", Pattern.CASE_INSENSITIVE));

        // SQL injection — common keywords and syntax
        PATTERNS.put("SQL injection",
                Pattern.compile(
                        "('\\s*(or|and)\\s*'?\\d)|" +             // ' OR 1
                                "(;\\s*drop\\s+table)|" +                  // ; DROP TABLE
                                "(union\\s+(all\\s+)?select)|" +           // UNION SELECT
                                "(select\\s+.*\\s+from)|" +                // SELECT ... FROM
                                "(insert\\s+into|delete\\s+from)|" +
                                "(exec(ute)?\\s*\\()|" +
                                "(xp_cmdshell)|" +
                                "(%27|%22).*(%6f%72|%4f%52)",              // URL-encoded OR
                        Pattern.CASE_INSENSITIVE));

        // XSS
        PATTERNS.put("XSS",
                Pattern.compile(
                        "(<script[^>]*>)|" +
                                "(javascript\\s*:)|" +
                                "(on(load|error|click|mouseover|focus)\\s*=)|" +
                                "(%3cscript)|(%3c%2fscript)",
                        Pattern.CASE_INSENSITIVE));

        // Command injection
        PATTERNS.put("Command injection",
                Pattern.compile(
                        "(;\\s*(ls|cat|wget|curl|bash|sh|python|perl|nc)\\s)|" +
                                "(`[^`]+`)|" +
                                "(\\$\\([^)]+\\))|" +           // $(cmd)
                                "(\\|\\|\\s*\\w+)|" +            // || cmd
                                "(%7c%7c|%60)",                  // URL-encoded || and `
                        Pattern.CASE_INSENSITIVE));
    }

    public InspectResult inspect(String input) {
        if (input == null || input.isBlank()) return InspectResult.clean();

        // URL-decode once before matching so encoded attacks don't slip through
        String decoded = urlDecode(input).toLowerCase(Locale.ROOT);

        for (Map.Entry<String, Pattern> entry : PATTERNS.entrySet()) {
            if (entry.getValue().matcher(decoded).find()) {
                return InspectResult.malicious(entry.getKey());
            }
        }
        return InspectResult.clean();
    }

    private String urlDecode(String s) {
        try {
            return java.net.URLDecoder.decode(s, "UTF-8");
        } catch (Exception e) {
            return s;
        }
    }

    public record InspectResult(boolean malicious, String reason) {
        static InspectResult malicious(String reason) { return new InspectResult(true, reason); }
        static InspectResult clean()                  { return new InspectResult(false, null);  }
        public boolean isMalicious() { return malicious; }
        public String  getReason()   { return reason;    }
    }
}