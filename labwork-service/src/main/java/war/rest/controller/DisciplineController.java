package war.rest.controller;

import java.util.ArrayList;
import java.util.List;

import jakarta.data.Order;
import jakarta.data.Sort;
import jakarta.data.page.PageRequest;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.BeanParam;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import war.model.dto.GetResourceRequestParams;
import war.model.dto.PageInfo;
import war.model.dto.disciplines.CreateDisciplineRequest;
import war.model.dto.disciplines.DisciplineDto;
import war.model.dto.disciplines.PatchDisciplineRequest;
import war.model.entity.DisciplineEntity;
import war.service.DisciplineService;

@Path("/disciplines")
@ApplicationScoped
public class DisciplineController {

    @Inject
    DisciplineService disciplineService;

    @GET
    @Produces(MediaType.APPLICATION_XML)
    public PageInfo<DisciplineDto> getDisciplines(@BeanParam @Valid GetResourceRequestParams params) {
        PageRequest pageRequest = PageRequest.ofPage(params.getPage(), params.getSize(), true);
        List<Sort<? super DisciplineEntity>> sorts = new ArrayList<>();

        params.getSort().forEach(e -> {
            e.trim();
            String[] parts = e.split(",");
            if (parts.length == 2 && parts[1].toLowerCase().matches("(asc|desc)")) {
                if (parts[1].toLowerCase().equals("asc"))
                    sorts.add(Sort.asc(parts[0]));
                else
                    sorts.add(Sort.desc(parts[0]));
            }
        });

        Order<DisciplineEntity> order = Order.<DisciplineEntity>by(sorts);
        return disciplineService.getAll(pageRequest, order);
    }

    @POST
    @Consumes(MediaType.APPLICATION_XML)
    @Produces(MediaType.APPLICATION_XML)
    public DisciplineDto createDisciplines(@Valid CreateDisciplineRequest req) {
        return disciplineService.create(req);
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_XML)
    public DisciplineDto getDiscipline(@PathParam(value = "id") String id) {
        return disciplineService.getById(id);
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_XML)
    @Produces(MediaType.APPLICATION_XML)
    public DisciplineDto updateDiscipline(@PathParam(value = "id") String id, @Valid CreateDisciplineRequest req) {
        return disciplineService.update(id, req);
    }

    @PATCH
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_XML)
    @Produces(MediaType.APPLICATION_XML)
    public DisciplineDto partiallyUpdateDiscipline(@PathParam(value = "id") String id,
            @Valid PatchDisciplineRequest req) {
        return disciplineService.partialUpdate(id, req);
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_XML)
    public void deleteDisciplineById(@PathParam(value = "id") String id) {
        disciplineService.delete(id);
    }
}
