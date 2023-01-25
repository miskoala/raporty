package org.mikala.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.mikala.web.rest.TestUtil;

class RaportTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Raport.class);
        Raport raport1 = new Raport();
        raport1.setId(1L);
        Raport raport2 = new Raport();
        raport2.setId(raport1.getId());
        assertThat(raport1).isEqualTo(raport2);
        raport2.setId(2L);
        assertThat(raport1).isNotEqualTo(raport2);
        raport1.setId(null);
        assertThat(raport1).isNotEqualTo(raport2);
    }
}
