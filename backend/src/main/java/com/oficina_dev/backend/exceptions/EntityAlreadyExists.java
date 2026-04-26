package com.oficina_dev.backend.exceptions;

public class EntityAlreadyExists extends RuntimeException {

    public EntityAlreadyExists() { super("Entity Already Exists"); }

    public EntityAlreadyExists(String message) { super(message); }

}
