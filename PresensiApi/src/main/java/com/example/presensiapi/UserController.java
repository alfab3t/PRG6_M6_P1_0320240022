package com.example.presensiapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public @ResponseBody DtoResponse login(
            @RequestBody Map<String, Object> parameter,
            @RequestHeader(value = "authcode", required = false) String authcode) {

        if (authcode == null) {
            return new DtoResponse(401, "Unauthorized - Missing Bearer Token", null);
        }

        if (!authcode.equals("astratech@123")) {
            return new DtoResponse(403, "Forbidden - Invalid Token", null);
        }

        String nim = parameter.get("nim").toString();
        String password = parameter.get("password").toString();

        User data = userRepository.findByMhsNimAndPassword(nim, password);

        if (data == null) {
            return new DtoResponse(501, "Not Found", null);
        }

        return new DtoResponse(200, "Data Found", data);
    }
}
