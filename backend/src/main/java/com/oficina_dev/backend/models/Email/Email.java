package com.oficina_dev.backend.models.Email;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Embeddable
@NoArgsConstructor
public class Email {

    @Column(name = "email", length = 100)
    private String email;

    public Email(String email) {
        setEmail(email);
    }

    public void setEmail(String email) {
        //TODO: Implement email validation logic here
        if (email == null || !email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        this.email = email;
    }
}
