package war.model.repo;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import war.model.entity.DisciplineEntity;

@Stateless
public class DisciplineQueryRepository {

    @PersistenceContext
    EntityManager em;

    private List<String> fields = List.of("name", "labsCount");
    private static final Pattern FILTER_PATTERN = Pattern.compile("^(name|labsCount)(>=|<=|=|~|>|<)(.*)$");

    public List<DisciplineEntity> findAll(List<String> filters, List<String> sort, Integer page, Integer size) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<DisciplineEntity> cq = cb.createQuery(DisciplineEntity.class);
        Root<DisciplineEntity> root = cq.from(DisciplineEntity.class);

        List<Order> order = new ArrayList<>();
        List<Predicate> predicates = new ArrayList<>();

        sort.forEach(e -> {
            e.trim();
            String[] parts = e.split(",");
            if (parts.length == 2 && parts[1].toLowerCase().matches("(asc|desc)") && fields.contains(parts[0])) {
                if (parts[1].toLowerCase().equals("asc"))
                    order.add(cb.asc(root.get(parts[0])));
                else
                    order.add(cb.desc(root.get(parts[0])));
            }
        });

        filters.forEach(e -> {
            Matcher matcher = FILTER_PATTERN.matcher(e.trim());

            if (matcher.matches() && !matcher.group(3).isBlank()) {
                String field = matcher.group(1);
                String op = matcher.group(2);
                String value = matcher.group(3);

                switch (op) {
                    case "=" -> predicates.add(cb.equal(root.get(field), value));

                    case "~" -> {
                        if (field.equals("name")) {
                            predicates.add(cb.like(root.get(field), String.format("%%%s%%", value)));
                        }
                    }

                    case ">" -> {
                        if (field.equals("labsCount")) {
                            predicates.add(cb.greaterThan(root.get(field), Long.valueOf(value)));
                        }
                    }

                    case ">=" -> {
                        if (field.equals("labsCount")) {
                            predicates.add(cb.greaterThanOrEqualTo(root.get(field), Long.valueOf(value)));
                        }
                    }

                    case "<" -> {
                        if (field.equals("labsCount")) {
                            predicates.add(cb.lessThan(root.get(field), Long.valueOf(value)));
                        }
                    }

                    case "<=" -> {
                        if (field.equals("labsCount")) {
                            predicates.add(cb.lessThanOrEqualTo(root.get(field), Long.valueOf(value)));
                        }
                    }

                    default -> {
                    }
                }
            }
        });

        cq.orderBy(order);
        cq.where(predicates);
        return em.createQuery(cq).setFirstResult(page * size).setMaxResults(size).getResultList();
    }
}
