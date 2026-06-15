package com.oficina_dev.backend.controllers.rest;

import com.oficina_dev.backend.exceptions.EntityAlreadyExists;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class RestExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(RestExceptionHandler.class);

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<RestErrorMessage> stateNotFoundHandler(EntityNotFoundException exception){
        RestErrorMessage errorMessage = new RestErrorMessage(
                HttpStatus.NOT_FOUND, exception.getMessage()
        );
        return ResponseEntity.status(errorMessage.httpStatus()).body(errorMessage);
    }

    @ExceptionHandler(EntityAlreadyExists.class)
    public ResponseEntity<RestErrorMessage> entityAlreadyExistsHandler(EntityAlreadyExists exception) {
        RestErrorMessage errorMessage = new RestErrorMessage(
                HttpStatus.BAD_REQUEST, exception.getMessage()
        );
        return ResponseEntity.status(errorMessage.httpStatus()).body(errorMessage);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<RestErrorMessage> handleValidationException(MethodArgumentNotValidException exception) {
        String details = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        String message = "Erro de validação: " + details;
        logger.error("Validation error: " + details);
        RestErrorMessage errorMessage = new RestErrorMessage(
                HttpStatus.BAD_REQUEST, message
        );
        return ResponseEntity.status(errorMessage.httpStatus()).body(errorMessage);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<RestErrorMessage> handleHttpMessageNotReadable(HttpMessageNotReadableException exception) {
        String message = "Erro ao processar a requisição: o corpo da requisição está malformado ou contém tipos inválidos.";
        logger.error("HTTP message not readable: " + exception.getMessage());
        RestErrorMessage errorMessage = new RestErrorMessage(
                HttpStatus.BAD_REQUEST, message
        );
        return ResponseEntity.status(errorMessage.httpStatus()).body(errorMessage);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<RestErrorMessage> dataIntegrityViolationHandler(DataIntegrityViolationException exception) {
        String message = "Não é possível concluir a operação pois existem outros dados vinculados a este registro.";
        if (exception.getRootCause() != null && exception.getRootCause().getMessage() != null) {
            logger.info("Data integrity violation root cause: " + exception.getRootCause().getMessage());
        }
        RestErrorMessage errorMessage = new RestErrorMessage(
                HttpStatus.CONFLICT, message
        );
        return ResponseEntity.status(errorMessage.httpStatus()).body(errorMessage);
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<RestErrorMessage> dataAccessExceptionHandler(DataAccessException exception) {
        logger.error("Data access exception: " + exception.getMessage(), exception);
        Throwable rootCause = exception.getRootCause();
        if (rootCause != null && rootCause.getMessage() != null && rootCause.getMessage().toLowerCase().contains("constraint")) {
            String message = "Não é possível concluir a operação pois existem outros dados vinculados a este registro.";
            RestErrorMessage errorMessage = new RestErrorMessage(
                    HttpStatus.CONFLICT, message
            );
            return ResponseEntity.status(errorMessage.httpStatus()).body(errorMessage);
        }
        RestErrorMessage errorMessage = new RestErrorMessage(
                HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao acessar o banco de dados: " + (exception.getMessage() != null ? exception.getMessage() : "erro desconhecido")
        );
        return ResponseEntity.status(errorMessage.httpStatus()).body(errorMessage);
    }

    // Catch-all handler for any other exception
    @ExceptionHandler(Exception.class)
    public ResponseEntity<RestErrorMessage> genericExceptionHandler(Exception exception) {
        logger.error("Unhandled exception: " + exception.getMessage(), exception);
        Throwable cause = exception.getCause();
        while (cause != null) {
            if (cause instanceof DataIntegrityViolationException ||
                (cause.getMessage() != null && cause.getMessage().toLowerCase().contains("constraint"))) {
                String message = "Não é possível concluir a operação pois existem outros dados vinculados a este registro.";
                RestErrorMessage errorMessage = new RestErrorMessage(
                        HttpStatus.CONFLICT, message
                );
                return ResponseEntity.status(errorMessage.httpStatus()).body(errorMessage);
            }
            cause = cause.getCause();
        }
        RestErrorMessage errorMessage = new RestErrorMessage(
                HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno: " + (exception.getMessage() != null ? exception.getMessage() : "erro desconhecido")
        );
        return ResponseEntity.status(errorMessage.httpStatus()).body(errorMessage);
    }

}
