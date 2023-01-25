package org.mikala.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.mikala.domain.Raport;
import org.mikala.repository.RaportRepository;
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
 * REST controller for managing {@link org.mikala.domain.Raport}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RaportResource {

    private final Logger log = LoggerFactory.getLogger(RaportResource.class);

    private static final String ENTITY_NAME = "raport";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RaportRepository raportRepository;

    public RaportResource(RaportRepository raportRepository) {
        this.raportRepository = raportRepository;
    }

    /**
     * {@code POST  /raports} : Create a new raport.
     *
     * @param raport the raport to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new raport, or with status {@code 400 (Bad Request)} if the raport has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/raports")
    public ResponseEntity<Raport> createRaport(@Valid @RequestBody Raport raport) throws URISyntaxException {
        log.debug("REST request to save Raport : {}", raport);
        if (raport.getId() != null) {
            throw new BadRequestAlertException("A new raport cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Raport result = raportRepository.save(raport);
        return ResponseEntity
            .created(new URI("/api/raports/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /raports/:id} : Updates an existing raport.
     *
     * @param id the id of the raport to save.
     * @param raport the raport to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated raport,
     * or with status {@code 400 (Bad Request)} if the raport is not valid,
     * or with status {@code 500 (Internal Server Error)} if the raport couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/raports/{id}")
    public ResponseEntity<Raport> updateRaport(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Raport raport
    ) throws URISyntaxException {
        log.debug("REST request to update Raport : {}, {}", id, raport);
        if (raport.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, raport.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!raportRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Raport result = raportRepository.save(raport);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, raport.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /raports/:id} : Partial updates given fields of an existing raport, field will ignore if it is null
     *
     * @param id the id of the raport to save.
     * @param raport the raport to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated raport,
     * or with status {@code 400 (Bad Request)} if the raport is not valid,
     * or with status {@code 404 (Not Found)} if the raport is not found,
     * or with status {@code 500 (Internal Server Error)} if the raport couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/raports/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Raport> partialUpdateRaport(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Raport raport
    ) throws URISyntaxException {
        log.debug("REST request to partial update Raport partially : {}, {}", id, raport);
        if (raport.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, raport.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!raportRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Raport> result = raportRepository
            .findById(raport.getId())
            .map(existingRaport -> {
                if (raport.getSymbol() != null) {
                    existingRaport.setSymbol(raport.getSymbol());
                }
                if (raport.getNazwa() != null) {
                    existingRaport.setNazwa(raport.getNazwa());
                }
                if (raport.getWersja() != null) {
                    existingRaport.setWersja(raport.getWersja());
                }

                return existingRaport;
            })
            .map(raportRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, raport.getId().toString())
        );
    }

    /**
     * {@code GET  /raports} : get all the raports.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of raports in body.
     */
    @GetMapping("/raports")
    public List<Raport> getAllRaports() {
        log.debug("REST request to get all Raports");
        return raportRepository.findAll();
    }

    /**
     * {@code GET  /raports/:id} : get the "id" raport.
     *
     * @param id the id of the raport to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the raport, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/raports/{id}")
    public ResponseEntity<Raport> getRaport(@PathVariable Long id) {
        log.debug("REST request to get Raport : {}", id);
        Optional<Raport> raport = raportRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(raport);
    }

    /**
     * {@code DELETE  /raports/:id} : delete the "id" raport.
     *
     * @param id the id of the raport to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/raports/{id}")
    public ResponseEntity<Void> deleteRaport(@PathVariable Long id) {
        log.debug("REST request to delete Raport : {}", id);
        raportRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
