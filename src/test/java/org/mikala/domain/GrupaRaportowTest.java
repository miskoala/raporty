package org.mikala.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.mikala.web.rest.TestUtil;

class GrupaRaportowTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GrupaRaportow.class);
        GrupaRaportow grupaRaportow1 = new GrupaRaportow();
        grupaRaportow1.setId(1L);
        GrupaRaportow grupaRaportow2 = new GrupaRaportow();
        grupaRaportow2.setId(grupaRaportow1.getId());
        assertThat(grupaRaportow1).isEqualTo(grupaRaportow2);
        grupaRaportow2.setId(2L);
        assertThat(grupaRaportow1).isNotEqualTo(grupaRaportow2);
        grupaRaportow1.setId(null);
        assertThat(grupaRaportow1).isNotEqualTo(grupaRaportow2);
    }
}
