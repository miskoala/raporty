package org.mikala.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.mikala.domain.Raport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class RaportRepositoryWithBagRelationshipsImpl implements RaportRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Raport> fetchBagRelationships(Optional<Raport> raport) {
        return raport.map(this::fetchGrupaRaportows);
    }

    @Override
    public Page<Raport> fetchBagRelationships(Page<Raport> raports) {
        return new PageImpl<>(fetchBagRelationships(raports.getContent()), raports.getPageable(), raports.getTotalElements());
    }

    @Override
    public List<Raport> fetchBagRelationships(List<Raport> raports) {
        return Optional.of(raports).map(this::fetchGrupaRaportows).orElse(Collections.emptyList());
    }

    Raport fetchGrupaRaportows(Raport result) {
        return entityManager
            .createQuery("select raport from Raport raport left join fetch raport.grupaRaportows where raport is :raport", Raport.class)
            .setParameter("raport", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Raport> fetchGrupaRaportows(List<Raport> raports) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, raports.size()).forEach(index -> order.put(raports.get(index).getId(), index));
        List<Raport> result = entityManager
            .createQuery(
                "select distinct raport from Raport raport left join fetch raport.grupaRaportows where raport in :raports",
                Raport.class
            )
            .setParameter("raports", raports)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
