package org.example.fluxguard.utils;

import java.security.SecureRandom;
import java.util.Base64;

/**
 * Generates cryptographically secure API keys for FluxGuard.
 *
 * Old format: "FG-1234-AbCd" → ~52 bits entropy → NOT acceptable for a security product.
 * New format: "FG-<32 url-safe base64 chars>" → 192 bits entropy → industry standard.
 *
 * Example output: FG-aB3xQz7mNpLwR1tYvK9uDcEoHjFsGi2
 *
 * Why SecureRandom?
 * java.util.Random is seeded from system clock → predictable under timing analysis.
 * SecureRandom uses OS entropy pool (e.g. /dev/urandom) → unpredictable by design.
 */
public final class ApiKeyGenerator {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final int KEY_BYTE_LENGTH = 24; // 24 bytes = 192 bits = 32 base64 chars

    private ApiKeyGenerator() {}

    /**
     * Generates a secure FluxGuard API key.
     * Format: FG-<32 alphanumeric chars>
     */
    public static String generate() {
        byte[] randomBytes = new byte[KEY_BYTE_LENGTH];
        SECURE_RANDOM.nextBytes(randomBytes);

        // URL-safe base64 without padding (no +, /, or =)
        String encoded = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);

        return "FG-" + encoded;
    }
}