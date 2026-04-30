package com.example.presensiapi;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
    User findByMhsNimAndPassword(String mhsNim, String password);
}
