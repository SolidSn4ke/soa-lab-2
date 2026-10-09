package war.rest.controller;

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
import war.service.LabworkService;

@Path("/labworks")
@ApplicationScoped
public class LabworkController {

    @Inject
    LabworkService labworkService;

    @GET
    @Produces(MediaType.APPLICATION_XML)
    public PageInfo<LabworkDto> getLabworks(@BeanParam @Valid GetResourceRequestParams params) {
        // TODO: add impl
        return null;
    }

    @POST
    @Consumes(MediaType.APPLICATION_XML)
    @Produces(MediaType.APPLICATION_XML)
    public LabworkDto createLabwork(@Valid CreateLabworkRequest req) {
        // TODO: add impl
        return null;
    }

    @DELETE
    @Produces(MediaType.APPLICATION_XML)
    public LabworkDto deleteOneLabworkByDifficulty(@QueryParam(value = "difficulty") Difficulty difficulty) {
        // TODO: add impl
        return null;
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_XML)
    public LabworkDto getLabwork(@PathParam(value = "id") Integer id) {
        // TODO: add impl
        return null;
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_XML)
    @Produces(MediaType.APPLICATION_XML)
    public LabworkDto updateLabwork(@PathParam(value = "id") Integer id, @Valid CreateLabworkRequest req) {
        // TODO: add impl
        return null;
    }

    @PATCH
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_XML)
    @Produces(MediaType.APPLICATION_XML)
    public LabworkDto partiallyUpdateLabwork(@PathParam(value = "id") Integer id, @Valid PatchLabworkRequest req) {
        // TODO: add impl
        return null;
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_XML)
    public LabworkDto deleteLabworkById(@PathParam(value = "id") Integer id) {
        // TODO: add impl
        return null;
    }
}
