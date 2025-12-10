package org.example.fluxguard.Exceptions;

public class IPBlockedException extends RuntimeException {
    public IPBlockedException(String message) {
        super(message);
    }
}
