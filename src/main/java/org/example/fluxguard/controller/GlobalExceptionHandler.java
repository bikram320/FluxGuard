package org.example.fluxguard.controller;

import org.example.fluxguard.Exceptions.CredentialsNotMatchException;
import org.example.fluxguard.Exceptions.DuplicateAppException;
import org.example.fluxguard.Exceptions.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String , String >> handleException(Exception e) {
        var errors = new HashMap<String, String>();
        errors.put("message", e.getMessage());
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(CredentialsNotMatchException.class)
    public ResponseEntity<Map<String , String >> handleCredentialsNotMatchException(CredentialsNotMatchException e) {
        var errors = new HashMap<String, String>();
        errors.put("message", e.getMessage());
        return ResponseEntity.status(401).body(errors);
    }
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String , String >> handleUserNotFoundException(UserNotFoundException e) {
        var errors = new HashMap<String, String>();
        errors.put("message", e.getMessage());
        return ResponseEntity.status(404).body(errors);
    }

    @ExceptionHandler(DuplicateAppException.class)
    public ResponseEntity<Map<String , String >> handleDuplicateAppException(DuplicateAppException e) {
        var errors = new HashMap<String, String>();
        errors.put("message", e.getMessage());
        return new ResponseEntity<>(errors, HttpStatus.CONFLICT);
    }
}
