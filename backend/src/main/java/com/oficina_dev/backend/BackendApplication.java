package com.oficina_dev.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		// Carrega .env se existir
		try {
			File envFile = new File(".env");
			if (envFile.exists()) {
				Dotenv dotenv = Dotenv.configure()
					.directory(".")
					.load();
				// Variáveis já estão carregadas no System.getenv()
			}
		} catch (Exception e) {
			System.out.println("Arquivo .env não encontrado ou erro ao carregar. Usando application.properties padrão.");
		}

		SpringApplication.run(BackendApplication.class, args);
	}
}

