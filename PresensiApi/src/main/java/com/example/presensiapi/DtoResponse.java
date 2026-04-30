package com.example.presensiapi;

public class DtoResponse {
    private int code;
    private String message;
    private Object data;

    public DtoResponse(int code, String message, Object data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public int getCode() { return code; }
    public String getMessage() { return message; }
    public Object getData() { return data; }
}
