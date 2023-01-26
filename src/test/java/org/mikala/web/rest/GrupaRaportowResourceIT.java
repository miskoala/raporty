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
import org.mikala.domain.GrupaRaportow;
import org.mikala.repository.GrupaRaportowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link GrupaRaportowResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GrupaRaportowResourceIT {

    private static final String DEFAULT_NAZWA = "AAAAAAAAAA";
    private static final String UPDATED_NAZWA = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/grupa-raportows";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GrupaRaportowRepository grupaRaportowRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGrupaRaportowMockMvc;

    private GrupaRaportow grupaRaportow;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GrupaRaportow createEntity(EntityManager em) {
        GrupaRaportow grupaRaportow = new GrupaRaportow().nazwa(DEFAULT_NAZWA);
        return grupaRaportow;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GrupaRaportow createUpdatedEntity(EntityManager em) {
        GrupaRaportow grupaRaportow = new GrupaRaportow().nazwa(UPDATED_NAZWA);
        return grupaRaportow;
    }

    @BeforeEach
    public void initTest() {
        grupaRaportow = createEntity(em);
    }

    @Test
    @Transactional
    void createGrupaRaportow() throws Exception {
        int databaseSizeBeforeCreate = grupaRaportowRepository.findAll().size();
        // Create the GrupaRaportow
        restGrupaRaportowMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grupaRaportow)))
            .andExpect(status().isCreated());

        // Validate the GrupaRaportow in the database
        List<GrupaRaportow> grupaRaportowList = grupaRaportowRepository.findAll();
        assertThat(grupaRaportowList).hasSize(databaseSizeBeforeCreate + 1);
        GrupaRaportow testGrupaRaportow = grupaRaportowList.get(grupaRaportowList.size() - 1);
        assertThat(testGrupaRaportow.getNazwa()).isEqualTo(DEFAULT_NAZWA);
    }

    @Test
    @Transactional
    void createGrupaRaportowWithExistingId() throws Exception {
        // Create the GrupaRaportow with an existing ID
        grupaRaportow.setId(1L);

        int databaseSizeBeforeCreate = grupaRaportowRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGrupaRaportowMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grupaRaportow)))
            .andExpect(status().isBadRequest());

        // Validate the GrupaRaportow in the database
        List<GrupaRaportow> grupaRaportowList = grupaRaportowRepository.findAll();
        assertThat(grupaRaportowList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNazwaIsRequired() throws Exception {
        int databaseSizeBeforeTest = grupaRaportowRepository.findAll().size();
        // set the field null
        grupaRaportow.setNazwa(null);

        // Create the GrupaRaportow, which fails.

        restGrupaRaportowMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grupaRaportow)))
            .andExpect(status().isBadRequest());

        List<GrupaRaportow> grupaRaportowList = grupaRaportowRepository.findAll();
        assertThat(grupaRaportowList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllGrupaRaportows() throws Exception {
        // Initialize the database
        grupaRaportowRepository.saveAndFlush(grupaRaportow);

        // Get all the grupaRaportowList
        restGrupaRaportowMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(grupaRaportow.getId().intValue())))
            .andExpect(jsonPath("$.[*].nazwa").value(hasItem(DEFAULT_NAZWA)));
    }

    @Test
    @Transactional
    void getGrupaRaportow() throws Exception {
        // Initialize the database
        grupaRaportowRepository.saveAndFlush(grupaRaportow);

        // Get the grupaRaportow
        restGrupaRaportowMockMvc
            .perform(get(ENTITY_API_URL_ID, grupaRaportow.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(grupaRaportow.getId().intValue()))
            .andExpect(jsonPath("$.nazwa").value(DEFAULT_NAZWA));
    }

    @Test
    @Transactional
    void getNonExistingGrupaRaportow() throws Exception {
        // Get the grupaRaportow
        restGrupaRaportowMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingGrupaRaportow() throws Exception {
        // Initialize the database
        grupaRaportowRepository.saveAndFlush(grupaRaportow);

        int databaseSizeBeforeUpdate = grupaRaportowRepository.findAll().size();

        // Update the grupaRaportow
        GrupaRaportow updatedGrupaRaportow = grupaRaportowRepository.findById(grupaRaportow.getId()).get();
        // Disconnect from session so that the updates on updatedGrupaRaportow are not directly saved in db
        em.detach(updatedGrupaRaportow);
        updatedGrupaRaportow.nazwa(UPDATED_NAZWA);

        restGrupaRaportowMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGrupaRaportow.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGrupaRaportow))
            )
            .andExpect(status().isOk());

        // Validate the GrupaRaportow in the database
        List<GrupaRaportow> grupaRaportowList = grupaRaportowRepository.findAll();
        assertThat(grupaRaportowList).hasSize(databaseSizeBeforeUpdate);
        GrupaRaportow testGrupaRaportow = grupaRaportowList.get(grupaRaportowList.size() - 1);
        assertThat(testGrupaRaportow.getNazwa()).isEqualTo(UPDATED_NAZWA);
    }

    @Test
    @Transactional
    void putNonExistingGrupaRaportow() throws Exception {
        int databaseSizeBeforeUpdate = grupaRaportowRepository.findAll().size();
        grupaRaportow.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGrupaRaportowMockMvc
            .perform(
                put(ENTITY_API_URL_ID, grupaRaportow.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(grupaRaportow))
            )
            .andExpect(status().isBadRequest());

        // Validate the GrupaRaportow in the database
        List<GrupaRaportow> grupaRaportowList = grupaRaportowRepository.findAll();
        assertThat(grupaRaportowList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGrupaRaportow() throws Exception {
        int databaseSizeBeforeUpdate = grupaRaportowRepository.findAll().size();
        grupaRaportow.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrupaRaportowMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(grupaRaportow))
            )
            .andExpect(status().isBadRequest());

        // Validate the GrupaRaportow in the database
        List<GrupaRaportow> grupaRaportowList = grupaRaportowRepository.findAll();
        assertThat(grupaRaportowList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGrupaRaportow() throws Exception {
        int databaseSizeBeforeUpdate = grupaRaportowRepository.findAll().size();
        grupaRaportow.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrupaRaportowMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grupaRaportow)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the GrupaRaportow in the database
        List<GrupaRaportow> grupaRaportowList = grupaRaportowRepository.findAll();
        assertThat(grupaRaportowList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGrupaRaportowWithPatch() throws Exception {
        // Initialize the database
        grupaRaportowRepository.saveAndFlush(grupaRaportow);

        int databaseSizeBeforeUpdate = grupaRaportowRepository.findAll().size();

        // Update the grupaRaportow using partial update
        GrupaRaportow partialUpdatedGrupaRaportow = new GrupaRaportow();
        partialUpdatedGrupaRaportow.setId(grupaRaportow.getId());

        partialUpdatedGrupaRaportow.nazwa(UPDATED_NAZWA);

        restGrupaRaportowMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGrupaRaportow.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGrupaRaportow))
            )
            .andExpect(status().isOk());

        // Validate the GrupaRaportow in the database
        List<GrupaRaportow> grupaRaportowList = grupaRaportowRepository.findAll();
        assertThat(grupaRaportowList).hasSize(databaseSizeBeforeUpdate);
        GrupaRaportow testGrupaRaportow = grupaRaportowList.get(grupaRaportowList.size() - 1);
        assertThat(testGrupaRaportow.getNazwa()).isEqualTo(UPDATED_NAZWA);
    }

    @Test
    @Transactional
    void fullUpdateGrupaRaportowWithPatch() throws Exception {
        // Initialize the database
        grupaRaportowRepository.saveAndFlush(grupaRaportow);

        int databaseSizeBeforeUpdate = grupaRaportowRepository.findAll().size();

        // Update the grupaRaportow using partial update
        GrupaRaportow partialUpdatedGrupaRaportow = new GrupaRaportow();
        partialUpdatedGrupaRaportow.setId(grupaRaportow.getId());

        partialUpdatedGrupaRaportow.nazwa(UPDATED_NAZWA);

        restGrupaRaportowMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGrupaRaportow.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGrupaRaportow))
            )
            .andExpect(status().isOk());

        // Validate the GrupaRaportow in the database
        List<GrupaRaportow> grupaRaportowList = grupaRaportowRepository.findAll();
        assertThat(grupaRaportowList).hasSize(databaseSizeBeforeUpdate);
        GrupaRaportow testGrupaRaportow = grupaRaportowList.get(grupaRaportowList.size() - 1);
        assertThat(testGrupaRaportow.getNazwa()).isEqualTo(UPDATED_NAZWA);
    }

    @Test
    @Transactional
    void patchNonExistingGrupaRaportow() throws Exception {
        int databaseSizeBeforeUpdate = grupaRaportowRepository.findAll().size();
        grupaRaportow.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGrupaRaportowMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, grupaRaportow.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(grupaRaportow))
            )
            .andExpect(status().isBadRequest());

        // Validate the GrupaRaportow in the database
        List<GrupaRaportow> grupaRaportowList = grupaRaportowRepository.findAll();
        assertThat(grupaRaportowList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGrupaRaportow() throws Exception {
        int databaseSizeBeforeUpdate = grupaRaportowRepository.findAll().size();
        grupaRaportow.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrupaRaportowMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(grupaRaportow))
            )
            .andExpect(status().isBadRequest());

        // Validate the GrupaRaportow in the database
        List<GrupaRaportow> grupaRaportowList = grupaRaportowRepository.findAll();
        assertThat(grupaRaportowList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGrupaRaportow() throws Exception {
        int databaseSizeBeforeUpdate = grupaRaportowRepository.findAll().size();
        grupaRaportow.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGrupaRaportowMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(grupaRaportow))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GrupaRaportow in the database
        List<GrupaRaportow> grupaRaportowList = grupaRaportowRepository.findAll();
        assertThat(grupaRaportowList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGrupaRaportow() throws Exception {
        // Initialize the database
        grupaRaportowRepository.saveAndFlush(grupaRaportow);

        int databaseSizeBeforeDelete = grupaRaportowRepository.findAll().size();

        // Delete the grupaRaportow
        restGrupaRaportowMockMvc
            .perform(delete(ENTITY_API_URL_ID, grupaRaportow.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<GrupaRaportow> grupaRaportowList = grupaRaportowRepository.findAll();
        assertThat(grupaRaportowList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
