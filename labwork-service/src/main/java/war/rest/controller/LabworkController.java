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
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import war.model.dto.GetResourceRequestParams;
import war.model.dto.PageInfo;
import war.model.dto.enums.Difficulty;
import war.model.dto.labworks.CreateLabworkRequest;
import war.model.dto.labworks.LabworkDto;
import war.model.dto.labworks.PatchLabworkRequest;
import war.model.entity.LabworkEntity;
import war.service.LabworkService;

@Path("/labworks")
@ApplicationScoped
public class LabworkController {

    @Inject
    LabworkService labworkService;

    @GET
    @Produces(MediaType.APPLICATION_XML)
    public PageInfo<LabworkDto> getLabworks(@BeanParam @Valid GetResourceRequestParams params) {
        PageRequest pageRequest = PageRequest.ofPage(params.getPage() + 1, params.getSize(), true);
        List<Sort<? super LabworkEntity>> sorts = new ArrayList<>();

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

        Order<LabworkEntity> order = Order.<LabworkEntity>by(sorts);
        return labworkService.getAll(pageRequest, order);
    }

    @POST
    @Consumes(MediaType.APPLICATION_XML)
    @Produces(MediaType.APPLICATION_XML)
    public LabworkDto createLabwork(@Valid CreateLabworkRequest req) {
        return labworkService.create(req);
    }

    @DELETE
    @Produces(MediaType.APPLICATION_XML)
    public void deleteOneLabworkByDifficulty(@QueryParam(value = "difficulty") Difficulty difficulty) {
        labworkService.deleteByDifficulty(difficulty);
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_XML)
    public LabworkDto getLabwork(@PathParam(value = "id") Integer id) {
        return labworkService.getById(id);
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_XML)
    @Produces(MediaType.APPLICATION_XML)
    public LabworkDto updateLabwork(@PathParam(value = "id") Integer id, @Valid CreateLabworkRequest req) {
        return labworkService.update(id, req);
    }

    @PATCH
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_XML)
    @Produces(MediaType.APPLICATION_XML)
    public LabworkDto partiallyUpdateLabwork(@PathParam(value = "id") Integer id, @Valid PatchLabworkRequest req) {
        return labworkService.partialUpdate(id, req);
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_XML)
    public void deleteLabworkById(@PathParam(value = "id") Integer id) {
        labworkService.delete(id);
    }
}
