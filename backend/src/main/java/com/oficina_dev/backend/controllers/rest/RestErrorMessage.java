package com.oficina_dev.backend.controllers.rest;

import org.springframework.http.HttpStatus;

public record RestErrorMessage (
        HttpStatus httpStatus,
        String message
) {}
