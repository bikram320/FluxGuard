package org.example.fluxguard.Exceptions;

public class DuplicateAppException extends RuntimeException {
    public DuplicateAppException(String message) {
        super(message);
    }
}
