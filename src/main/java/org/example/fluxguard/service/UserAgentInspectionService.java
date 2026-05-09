package org.example.fluxguard.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

/**
 * Inspects the User-Agent header for:
 *  - Empty / missing UA  (almost always a bot or scanner)
 *  - Known bad-bot signatures
 *  - Vulnerability scanner signatures (sqlmap, nikto, nmap, etc.)
 *  - Headless browser signatures often used in scraping (HeadlessChrome)
 */
@Service
public class UserAgentInspectionService {

    // Known malicious / scanner user-agent substrings (lowercase)
    private static final List<String> BAD_SIGNATURES = List.of(
            "sqlmap", "nikto", "nmap", "masscan", "zgrab",
            "dirbuster", "gobuster", "wfuzz", "hydra", "metasploit",
            "nuclei", "shodan", "censys", "acunetix", "nessus",
            "openvas", "w3af", "burpsuite", "havij", "pangolin",
            "python-requests/2.1",   // very old version — often scanners
            "go-http-client/1.1",    // raw Go HTTP, common in bots
            "java/1.8.0",            // raw Java HTTP without a real UA
            "curl/7.0"               // extremely old curl, rare in legit traffic
    );

    // Headless / automated browser signatures
    private static final List<String> HEADLESS_SIGNATURES = List.of(
            "headlesschrome", "phantomjs", "slimerjs", "seleniumwire",
            "webdriver", "__selenium", "chromedriver"
    );

    public UaResult inspect(String userAgent) {
        if (userAgent == null || userAgent.isBlank()) {
            return UaResult.block("Empty or missing User-Agent");
        }

        String ua = userAgent.toLowerCase(Locale.ROOT);

        for (String sig : BAD_SIGNATURES) {
            if (ua.contains(sig)) {
                return UaResult.block("Known scanner detected: " + sig);
            }
        }

        for (String sig : HEADLESS_SIGNATURES) {
            if (ua.contains(sig)) {
                return UaResult.block("Headless/automated browser detected");
            }
        }

        return UaResult.allow();
    }

    public record UaResult(boolean blocked, String reason) {
        static UaResult block(String reason) { return new UaResult(true, reason); }
        static UaResult allow()              { return new UaResult(false, null);  }
        public boolean isBlocked()  { return blocked; }
        public String  getReason()  { return reason;  }
    }
}