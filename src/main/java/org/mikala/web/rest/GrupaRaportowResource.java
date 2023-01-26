package org.mikala.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.mikala.domain.GrupaRaportow;
import org.mikala.repository.GrupaRaportowRepository;
import org.mikala.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.mikala.domain.GrupaRaportow}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class GrupaRaportowResource {

    private final Logger log = LoggerFactory.getLogger(GrupaRaportowResource.class);

    private static final String ENTITY_NAME = "grupaRaportow";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GrupaRaportowRepository grupaRaportowRepository;

    public GrupaRaportowResource(GrupaRaportowRepository grupaRaportowRepository) {
        this.grupaRaportowRepository = grupaRaportowRepository;
    }

    /**
     * {@code POST  /grupa-raportows} : Create a new grupaRaportow.
     *
     * @param grupaRaportow the grupaRaportow to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new grupaRaportow, or with status {@code 400 (Bad Request)} if the grupaRaportow has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/grupa-raportows")
    public ResponseEntity<GrupaRaportow> createGrupaRaportow(@Valid @RequestBody GrupaRaportow grupaRaportow) throws URISyntaxException {
        log.debug("REST request to save GrupaRaportow : {}", grupaRaportow);
        if (grupaRaportow.getId() != null) {
            throw new BadRequestAlertException("A new grupaRaportow cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GrupaRaportow result = grupaRaportowRepository.save(grupaRaportow);
        return ResponseEntity
            .created(new URI("/api/grupa-raportows/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /grupa-raportows/:id} : Updates an existing grupaRaportow.
     *
     * @param id the id of the grupaRaportow to save.
     * @param grupaRaportow the grupaRaportow to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grupaRaportow,
     * or with status {@code 400 (Bad Request)} if the grupaRaportow is not valid,
     * or with status {@code 500 (Internal Server Error)} if the grupaRaportow couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/grupa-raportows/{id}")
    public ResponseEntity<GrupaRaportow> updateGrupaRaportow(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody GrupaRaportow grupaRaportow
    ) throws URISyntaxException {
        log.debug("REST request to update GrupaRaportow : {}, {}", id, grupaRaportow);
        if (grupaRaportow.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grupaRaportow.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!grupaRaportowRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        GrupaRaportow result = grupaRaportowRepository.save(grupaRaportow);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, grupaRaportow.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /grupa-raportows/:id} : Partial updates given fields of an existing grupaRaportow, field will ignore if it is null
     *
     * @param id the id of the grupaRaportow to save.
     * @param grupaRaportow the grupaRaportow to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grupaRaportow,
     * or with status {@code 400 (Bad Request)} if the grupaRaportow is not valid,
     * or with status {@code 404 (Not Found)} if the grupaRaportow is not found,
     * or with status {@code 500 (Internal Server Error)} if the grupaRaportow couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/grupa-raportows/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<GrupaRaportow> partialUpdateGrupaRaportow(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody GrupaRaportow grupaRaportow
    ) throws URISyntaxException {
        log.debug("REST request to partial update GrupaRaportow partially : {}, {}", id, grupaRaportow);
        if (grupaRaportow.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grupaRaportow.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!grupaRaportowRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GrupaRaportow> result = grupaRaportowRepository
            .findById(grupaRaportow.getId())
            .map(existingGrupaRaportow -> {
                if (grupaRaportow.getNazwa() != null) {
                    existingGrupaRaportow.setNazwa(grupaRaportow.getNazwa());
                }

                return existingGrupaRaportow;
            })
            .map(grupaRaportowRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, grupaRaportow.getId().toString())
        );
    }

    /**
     * {@code GET  /grupa-raportows} : get all the grupaRaportows.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of grupaRaportows in body.
     */
    @GetMapping("/grupa-raportows")
    public List<GrupaRaportow> getAllGrupaRaportows() {
        log.debug("REST request to get all GrupaRaportows");
        return grupaRaportowRepository.findAll();
    }

    /**
     * {@code GET  /grupa-raportows/:id} : get the "id" grupaRaportow.
     *
     * @param id the id of the grupaRaportow to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the grupaRaportow, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/grupa-raportows/{id}")
    public ResponseEntity<GrupaRaportow> getGrupaRaportow(@PathVariable Long id) {
        log.debug("REST request to get GrupaRaportow : {}", id);
        Optional<GrupaRaportow> grupaRaportow = grupaRaportowRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(grupaRaportow);
    }

    /**
     * {@code DELETE  /grupa-raportows/:id} : delete the "id" grupaRaportow.
     *
     * @param id the id of the grupaRaportow to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/grupa-raportows/{id}")
    public ResponseEntity<Void> deleteGrupaRaportow(@PathVariable Long id) {
        log.debug("REST request to delete GrupaRaportow : {}", id);
        grupaRaportowRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
