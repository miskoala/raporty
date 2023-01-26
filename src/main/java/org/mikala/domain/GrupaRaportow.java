package org.mikala.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A GrupaRaportow.
 */
@Entity
@Table(name = "grupa_raportow")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GrupaRaportow implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(min = 10, max = 255)
    @Column(name = "nazwa", length = 255, nullable = false, unique = true)
    private String nazwa;

    @ManyToMany(mappedBy = "grupaRaportows")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "grupaRaportows" }, allowSetters = true)
    private Set<Raport> raporties = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public GrupaRaportow id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNazwa() {
        return this.nazwa;
    }

    public GrupaRaportow nazwa(String nazwa) {
        this.setNazwa(nazwa);
        return this;
    }

    public void setNazwa(String nazwa) {
        this.nazwa = nazwa;
    }

    public Set<Raport> getRaporties() {
        return this.raporties;
    }

    public void setRaporties(Set<Raport> raports) {
        if (this.raporties != null) {
            this.raporties.forEach(i -> i.removeGrupaRaportow(this));
        }
        if (raports != null) {
            raports.forEach(i -> i.addGrupaRaportow(this));
        }
        this.raporties = raports;
    }

    public GrupaRaportow raporties(Set<Raport> raports) {
        this.setRaporties(raports);
        return this;
    }

    public GrupaRaportow addRaporty(Raport raport) {
        this.raporties.add(raport);
        raport.getGrupaRaportows().add(this);
        return this;
    }

    public GrupaRaportow removeRaporty(Raport raport) {
        this.raporties.remove(raport);
        raport.getGrupaRaportows().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GrupaRaportow)) {
            return false;
        }
        return id != null && id.equals(((GrupaRaportow) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GrupaRaportow{" +
            "id=" + getId() +
            ", nazwa='" + getNazwa() + "'" +
            "}";
    }
}
