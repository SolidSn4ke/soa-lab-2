package war.model.repo;

import java.time.ZonedDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.ws.rs.BadRequestException;
import war.model.dto.enums.Difficulty;
import war.model.entity.LabworkEntity;

@Stateless
public class LabworkQueryRepository {

    @PersistenceContext
    EntityManager em;

    private static final Set<String> FIELDS = Set.of("id", "name", "coordinates.x", "coordinates.y",
            "creationDate", "minimalPoint", "averagePoint", "difficulty", "discipline.name");
    private static final Pattern FILTER_PATTERN = Pattern.compile("^([A-Za-z][A-Za-z0-9.]*)(>=|<=|=|~|>|<)(.+)$");

    public List<LabworkEntity> findAll(List<String> filters, List<String> sort, Integer page, Integer size) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<LabworkEntity> query = cb.createQuery(LabworkEntity.class);
        Root<LabworkEntity> root = query.from(LabworkEntity.class);
        root.fetch("discipline");
        query.where(predicates(cb, root, filters).toArray(Predicate[]::new));
        query.orderBy(orders(cb, root, sort));

        long offset = (long) page * size;
        if (offset > Integer.MAX_VALUE) {
            throw new BadRequestException("Page offset is too large");
        }
        return em.createQuery(query).setFirstResult((int) offset).setMaxResults(size).getResultList();
    }

    public long count(List<String> filters) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Long> query = cb.createQuery(Long.class);
        Root<LabworkEntity> root = query.from(LabworkEntity.class);
        query.select(cb.count(root));
        query.where(predicates(cb, root, filters).toArray(Predicate[]::new));
        return em.createQuery(query).getSingleResult();
    }

    private List<Order> orders(CriteriaBuilder cb, Root<LabworkEntity> root, List<String> sort) {
        List<Order> orders = new ArrayList<>();
        if (sort != null) {
            for (String entry : sort) {
                String[] parts = entry.split(",", -1);
                if (parts.length != 2 || !FIELDS.contains(parts[0].trim())) {
                    throw new BadRequestException("Invalid sort: " + entry);
                }
                Path<?> path = path(root, parts[0].trim());
                switch (parts[1].trim().toLowerCase(Locale.ROOT)) {
                    case "asc" -> orders.add(cb.asc(path));
                    case "desc" -> orders.add(cb.desc(path));
                    default -> throw new BadRequestException("Invalid sort: " + entry);
                }
            }
        }
        orders.add(cb.asc(root.get("id")));
        return orders;
    }

    private List<Predicate> predicates(CriteriaBuilder cb, Root<LabworkEntity> root, List<String> filters) {
        List<Predicate> predicates = new ArrayList<>();
        if (filters == null) {
            return predicates;
        }
        for (String filter : filters) {
            Matcher matcher = FILTER_PATTERN.matcher(filter.trim());
            if (!matcher.matches() || matcher.group(3).isBlank()) {
                throw new BadRequestException("Invalid search filter: " + filter);
            }
            String field = matcher.group(1);
            String operator = matcher.group(2);
            String value = matcher.group(3).trim();
            try {
                Predicate predicate = switch (field) {
                    case "name" -> stringPredicate(cb, root.get("name"), operator, value);
                    case "discipline.name" -> stringPredicate(cb, root.get("discipline").get("name"), operator, value);
                    case "id" -> numberPredicate(cb, root.get("id"), operator, Integer.valueOf(value));
                    case "coordinates.x" -> numberPredicate(cb, root.get("coordinates").get("x"), operator,
                            Long.valueOf(value));
                    case "coordinates.y" -> numberPredicate(cb, root.get("coordinates").get("y"), operator,
                            Float.valueOf(value));
                    case "minimalPoint" -> numberPredicate(cb, root.get("minimalPoint"), operator, Long.valueOf(value));
                    case "averagePoint" -> numberPredicate(cb, root.get("averagePoint"), operator, Long.valueOf(value));
                    case "difficulty" -> equalityPredicate(cb, root.get("difficulty"), operator,
                            Difficulty.valueOf(value));
                    case "creationDate" -> datePredicate(cb, root.get("creationDate"), operator,
                            ZonedDateTime.parse(value));
                    default -> throw new BadRequestException("Invalid search field: " + field);
                };
                predicates.add(predicate);
            } catch (IllegalArgumentException | DateTimeParseException ex) {
                throw new BadRequestException("Invalid value for search field: " + field, ex);
            }
        }
        return predicates;
    }

    private Path<?> path(Root<LabworkEntity> root, String field) {
        return switch (field) {
            case "coordinates.x" -> root.get("coordinates").get("x");
            case "coordinates.y" -> root.get("coordinates").get("y");
            case "discipline.name" -> root.get("discipline").get("name");
            default -> root.get(field);
        };
    }

    private Predicate stringPredicate(CriteriaBuilder cb, Expression<String> field, String operator, String value) {
        return switch (operator) {
            case "=" -> cb.equal(field, value);
            case "~" -> cb.like(field, "%" + value + "%");
            default -> throw new BadRequestException("Invalid operator for string field: " + operator);
        };
    }

    private Predicate numberPredicate(CriteriaBuilder cb, Expression<? extends Number> field, String operator,
            Number value) {
        return switch (operator) {
            case "=" -> cb.equal(field, value);
            case ">" -> cb.gt(field, value);
            case ">=" -> cb.ge(field, value);
            case "<" -> cb.lt(field, value);
            case "<=" -> cb.le(field, value);
            default -> throw new BadRequestException("Invalid operator for numeric field: " + operator);
        };
    }

    private Predicate equalityPredicate(CriteriaBuilder cb, Expression<?> field, String operator, Object value) {
        if (!operator.equals("=")) {
            throw new BadRequestException("Invalid operator: " + operator);
        }
        return cb.equal(field, value);
    }

    private Predicate datePredicate(CriteriaBuilder cb, Expression<ZonedDateTime> field, String operator,
            ZonedDateTime value) {
        return switch (operator) {
            case "=" -> cb.equal(field, value);
            case ">" -> cb.greaterThan(field, value);
            case ">=" -> cb.greaterThanOrEqualTo(field, value);
            case "<" -> cb.lessThan(field, value);
            case "<=" -> cb.lessThanOrEqualTo(field, value);
            default -> throw new BadRequestException("Invalid operator for date field: " + operator);
        };
    }
}
