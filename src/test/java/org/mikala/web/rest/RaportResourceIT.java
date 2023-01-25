package org.mikala.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mikala.IntegrationTest;
import org.mikala.domain.Raport;
import org.mikala.repository.RaportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link RaportResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RaportResourceIT {

    private static final String DEFAULT_SYMBOL = "AAAAAAAAAA";
    private static final String UPDATED_SYMBOL = "BBBBBBBBBB";

    private static final String DEFAULT_NAZWA = "AAAAAAAAAA";
    private static final String UPDATED_NAZWA = "BBBBBBBBBB";

    private static final Integer DEFAULT_WERSJA = 1;
    private static final Integer UPDATED_WERSJA = 2;

    private static final String ENTITY_API_URL = "/api/raports";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RaportRepository raportRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRaportMockMvc;

    private Raport raport;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Raport createEntity(EntityManager em) {
        Raport raport = new Raport().symbol(DEFAULT_SYMBOL).nazwa(DEFAULT_NAZWA).wersja(DEFAULT_WERSJA);
        return raport;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Raport createUpdatedEntity(EntityManager em) {
        Raport raport = new Raport().symbol(UPDATED_SYMBOL).nazwa(UPDATED_NAZWA).wersja(UPDATED_WERSJA);
        return raport;
    }

    @BeforeEach
    public void initTest() {
        raport = createEntity(em);
    }

    @Test
    @Transactional
    void createRaport() throws Exception {
        int databaseSizeBeforeCreate = raportRepository.findAll().size();
        // Create the Raport
        restRaportMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(raport)))
            .andExpect(status().isCreated());

        // Validate the Raport in the database
        List<Raport> raportList = raportRepository.findAll();
        assertThat(raportList).hasSize(databaseSizeBeforeCreate + 1);
        Raport testRaport = raportList.get(raportList.size() - 1);
        assertThat(testRaport.getSymbol()).isEqualTo(DEFAULT_SYMBOL);
        assertThat(testRaport.getNazwa()).isEqualTo(DEFAULT_NAZWA);
        assertThat(testRaport.getWersja()).isEqualTo(DEFAULT_WERSJA);
    }

    @Test
    @Transactional
    void createRaportWithExistingId() throws Exception {
        // Create the Raport with an existing ID
        raport.setId(1L);

        int databaseSizeBeforeCreate = raportRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRaportMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(raport)))
            .andExpect(status().isBadRequest());

        // Validate the Raport in the database
        List<Raport> raportList = raportRepository.findAll();
        assertThat(raportList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkSymbolIsRequired() throws Exception {
        int databaseSizeBeforeTest = raportRepository.findAll().size();
        // set the field null
        raport.setSymbol(null);

        // Create the Raport, which fails.

        restRaportMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(raport)))
            .andExpect(status().isBadRequest());

        List<Raport> raportList = raportRepository.findAll();
        assertThat(raportList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNazwaIsRequired() throws Exception {
        int databaseSizeBeforeTest = raportRepository.findAll().size();
        // set the field null
        raport.setNazwa(null);

        // Create the Raport, which fails.

        restRaportMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(raport)))
            .andExpect(status().isBadRequest());

        List<Raport> raportList = raportRepository.findAll();
        assertThat(raportList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkWersjaIsRequired() throws Exception {
        int databaseSizeBeforeTest = raportRepository.findAll().size();
        // set the field null
        raport.setWersja(null);

        // Create the Raport, which fails.

        restRaportMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(raport)))
            .andExpect(status().isBadRequest());

        List<Raport> raportList = raportRepository.findAll();
        assertThat(raportList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllRaports() throws Exception {
        // Initialize the database
        raportRepository.saveAndFlush(raport);

        // Get all the raportList
        restRaportMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(raport.getId().intValue())))
            .andExpect(jsonPath("$.[*].symbol").value(hasItem(DEFAULT_SYMBOL)))
            .andExpect(jsonPath("$.[*].nazwa").value(hasItem(DEFAULT_NAZWA)))
            .andExpect(jsonPath("$.[*].wersja").value(hasItem(DEFAULT_WERSJA)));
    }

    @Test
    @Transactional
    void getRaport() throws Exception {
        // Initialize the database
        raportRepository.saveAndFlush(raport);

        // Get the raport
        restRaportMockMvc
            .perform(get(ENTITY_API_URL_ID, raport.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(raport.getId().intValue()))
            .andExpect(jsonPath("$.symbol").value(DEFAULT_SYMBOL))
            .andExpect(jsonPath("$.nazwa").value(DEFAULT_NAZWA))
            .andExpect(jsonPath("$.wersja").value(DEFAULT_WERSJA));
    }

    @Test
    @Transactional
    void getNonExistingRaport() throws Exception {
        // Get the raport
        restRaportMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRaport() throws Exception {
        // Initialize the database
        raportRepository.saveAndFlush(raport);

        int databaseSizeBeforeUpdate = raportRepository.findAll().size();

        // Update the raport
        Raport updatedRaport = raportRepository.findById(raport.getId()).get();
        // Disconnect from session so that the updates on updatedRaport are not directly saved in db
        em.detach(updatedRaport);
        updatedRaport.symbol(UPDATED_SYMBOL).nazwa(UPDATED_NAZWA).wersja(UPDATED_WERSJA);

        restRaportMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRaport.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRaport))
            )
            .andExpect(status().isOk());

        // Validate the Raport in the database
        List<Raport> raportList = raportRepository.findAll();
        assertThat(raportList).hasSize(databaseSizeBeforeUpdate);
        Raport testRaport = raportList.get(raportList.size() - 1);
        assertThat(testRaport.getSymbol()).isEqualTo(UPDATED_SYMBOL);
        assertThat(testRaport.getNazwa()).isEqualTo(UPDATED_NAZWA);
        assertThat(testRaport.getWersja()).isEqualTo(UPDATED_WERSJA);
    }

    @Test
    @Transactional
    void putNonExistingRaport() throws Exception {
        int databaseSizeBeforeUpdate = raportRepository.findAll().size();
        raport.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRaportMockMvc
            .perform(
                put(ENTITY_API_URL_ID, raport.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(raport))
            )
            .andExpect(status().isBadRequest());

        // Validate the Raport in the database
        List<Raport> raportList = raportRepository.findAll();
        assertThat(raportList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRaport() throws Exception {
        int databaseSizeBeforeUpdate = raportRepository.findAll().size();
        raport.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRaportMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(raport))
            )
            .andExpect(status().isBadRequest());

        // Validate the Raport in the database
        List<Raport> raportList = raportRepository.findAll();
        assertThat(raportList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRaport() throws Exception {
        int databaseSizeBeforeUpdate = raportRepository.findAll().size();
        raport.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRaportMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(raport)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Raport in the database
        List<Raport> raportList = raportRepository.findAll();
        assertThat(raportList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRaportWithPatch() throws Exception {
        // Initialize the database
        raportRepository.saveAndFlush(raport);

        int databaseSizeBeforeUpdate = raportRepository.findAll().size();

        // Update the raport using partial update
        Raport partialUpdatedRaport = new Raport();
        partialUpdatedRaport.setId(raport.getId());

        partialUpdatedRaport.symbol(UPDATED_SYMBOL).nazwa(UPDATED_NAZWA).wersja(UPDATED_WERSJA);

        restRaportMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRaport.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRaport))
            )
            .andExpect(status().isOk());

        // Validate the Raport in the database
        List<Raport> raportList = raportRepository.findAll();
        assertThat(raportList).hasSize(databaseSizeBeforeUpdate);
        Raport testRaport = raportList.get(raportList.size() - 1);
        assertThat(testRaport.getSymbol()).isEqualTo(UPDATED_SYMBOL);
        assertThat(testRaport.getNazwa()).isEqualTo(UPDATED_NAZWA);
        assertThat(testRaport.getWersja()).isEqualTo(UPDATED_WERSJA);
    }

    @Test
    @Transactional
    void fullUpdateRaportWithPatch() throws Exception {
        // Initialize the database
        raportRepository.saveAndFlush(raport);

        int databaseSizeBeforeUpdate = raportRepository.findAll().size();

        // Update the raport using partial update
        Raport partialUpdatedRaport = new Raport();
        partialUpdatedRaport.setId(raport.getId());

        partialUpdatedRaport.symbol(UPDATED_SYMBOL).nazwa(UPDATED_NAZWA).wersja(UPDATED_WERSJA);

        restRaportMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRaport.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRaport))
            )
            .andExpect(status().isOk());

        // Validate the Raport in the database
        List<Raport> raportList = raportRepository.findAll();
        assertThat(raportList).hasSize(databaseSizeBeforeUpdate);
        Raport testRaport = raportList.get(raportList.size() - 1);
        assertThat(testRaport.getSymbol()).isEqualTo(UPDATED_SYMBOL);
        assertThat(testRaport.getNazwa()).isEqualTo(UPDATED_NAZWA);
        assertThat(testRaport.getWersja()).isEqualTo(UPDATED_WERSJA);
    }

    @Test
    @Transactional
    void patchNonExistingRaport() throws Exception {
        int databaseSizeBeforeUpdate = raportRepository.findAll().size();
        raport.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRaportMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, raport.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(raport))
            )
            .andExpect(status().isBadRequest());

        // Validate the Raport in the database
        List<Raport> raportList = raportRepository.findAll();
        assertThat(raportList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRaport() throws Exception {
        int databaseSizeBeforeUpdate = raportRepository.findAll().size();
        raport.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRaportMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(raport))
            )
            .andExpect(status().isBadRequest());

        // Validate the Raport in the database
        List<Raport> raportList = raportRepository.findAll();
        assertThat(raportList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRaport() throws Exception {
        int databaseSizeBeforeUpdate = raportRepository.findAll().size();
        raport.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRaportMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(raport)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Raport in the database
        List<Raport> raportList = raportRepository.findAll();
        assertThat(raportList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRaport() throws Exception {
        // Initialize the database
        raportRepository.saveAndFlush(raport);

        int databaseSizeBeforeDelete = raportRepository.findAll().size();

        // Delete the raport
        restRaportMockMvc
            .perform(delete(ENTITY_API_URL_ID, raport.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Raport> raportList = raportRepository.findAll();
        assertThat(raportList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
