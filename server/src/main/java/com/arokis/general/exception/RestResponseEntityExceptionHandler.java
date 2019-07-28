package com.arokis.general.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;


public class RestResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {


    @ExceptionHandler(value = {ConstraintViolationException.class})
    public ResponseEntity<Object> handleConstraint(ConstraintViolationException ex,
                                                   WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setSuccess(false);
        errorResponse.setMessage("Nieprawidłowe parametry.");
        for (ConstraintViolation<?> constraintViolation : ex.getConstraintViolations()) {
            String[] path = constraintViolation.getPropertyPath().toString().split("\\.");
            errorResponse.addErrorField(path[path.length - 1], constraintViolation.getMessage());
        }
        return new ResponseEntity(errorResponse, HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(value = {Exception.class})
    public final ResponseEntity<Object> handleAllExceptions(Exception ex, WebRequest request) {
        System.out.println("EXCEPTION:");

//        ExceptionResponse exceptionResponse = new ExceptionResponse(new Date(), ex.getMessage()+" Custom Error",
//                request.getDescription(false));
        return new ResponseEntity("b", HttpStatus.INTERNAL_SERVER_ERROR);
    }

}