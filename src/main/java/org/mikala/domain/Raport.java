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
 * A Raport.
 */
@Entity
@Table(name = "raport")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Raport implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(min = 2, max = 20)
    @Column(name = "symbol", length = 20, nullable = false, unique = true)
    private String symbol;

    @NotNull
    @Size(min = 2, max = 255)
    @Column(name = "nazwa", length = 255, nullable = false)
    private String nazwa;

    @NotNull
    @Min(value = 1)
    @Column(name = "wersja", nullable = false)
    private Integer wersja;

    @ManyToMany
    @JoinTable(
        name = "rel_raport__grupa_raportow",
        joinColumns = @JoinColumn(name = "raport_id"),
        inverseJoinColumns = @JoinColumn(name = "grupa_raportow_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "raporties" }, allowSetters = true)
    private Set<GrupaRaportow> grupaRaportows = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Raport id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSymbol() {
        return this.symbol;
    }

    public Raport symbol(String symbol) {
        this.setSymbol(symbol);
        return this;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getNazwa() {
        return this.nazwa;
    }

    public Raport nazwa(String nazwa) {
        this.setNazwa(nazwa);
        return this;
    }

    public void setNazwa(String nazwa) {
        this.nazwa = nazwa;
    }

    public Integer getWersja() {
        return this.wersja;
    }

    public Raport wersja(Integer wersja) {
        this.setWersja(wersja);
        return this;
    }

    public void setWersja(Integer wersja) {
        this.wersja = wersja;
    }

    public Set<GrupaRaportow> getGrupaRaportows() {
        return this.grupaRaportows;
    }

    public void setGrupaRaportows(Set<GrupaRaportow> grupaRaportows) {
        this.grupaRaportows = grupaRaportows;
    }

    public Raport grupaRaportows(Set<GrupaRaportow> grupaRaportows) {
        this.setGrupaRaportows(grupaRaportows);
        return this;
    }

    public Raport addGrupaRaportow(GrupaRaportow grupaRaportow) {
        this.grupaRaportows.add(grupaRaportow);
        grupaRaportow.getRaporties().add(this);
        return this;
    }

    public Raport removeGrupaRaportow(GrupaRaportow grupaRaportow) {
        this.grupaRaportows.remove(grupaRaportow);
        grupaRaportow.getRaporties().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Raport)) {
            return false;
        }
        return id != null && id.equals(((Raport) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Raport{" +
            "id=" + getId() +
            ", symbol='" + getSymbol() + "'" +
            ", nazwa='" + getNazwa() + "'" +
            ", wersja=" + getWersja() +
            "}";
    }
}
