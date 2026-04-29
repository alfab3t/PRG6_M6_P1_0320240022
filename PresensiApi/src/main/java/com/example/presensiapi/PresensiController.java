package com.example.presensiapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/presensi")
@CrossOrigin(origins = "*")
public class PresensiController {

    @Autowired
    private PresensiRepository repository;

    // GET history presensi by NIM dengan pagination
    // URL: /api/presensi/history/{nim}?page=0&size=10
    @GetMapping("/history/{nim}")
    public Page<Presensi> getHistory(
            @PathVariable String nim,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return repository.findByNimMhs(nim, pageable);
    }

    // POST simpan presensi baru
    // URL: /api/presensi
    @PostMapping
    public Presensi create(@RequestBody Presensi presensi) {
        return repository.save(presensi);
    }

    // PUT ubah presensi
    // URL: /api/presensi/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Presensi> update(
            @PathVariable Long id,
            @RequestBody Presensi updatedData) {

        return repository.findById(id)
                .map(presensi -> {
                    if (updatedData.getStatus() != null) {
                        presensi.setStatus(updatedData.getStatus());
                    }
                    if (updatedData.getJamPresensi() != null) {
                        presensi.setJamPresensi(updatedData.getJamPresensi());
                    }
                    return ResponseEntity.ok(repository.save(presensi));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
