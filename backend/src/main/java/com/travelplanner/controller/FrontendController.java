package com.travelplanner.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {

    /**
     * Forwards all requests that don't end in an extension to index.html.
     * This allows React Router (Single Page Application) to handle the routing
     * natively rather than Spring Boot throwing a 404 Error for paths like /explore or /plan.
     */
    @RequestMapping(value = { "/", "/{x:[\\w\\-]+}", "/{x:^(?!api$).*$}/**/{y:[\\w\\-]+}" })
    public String forwardSPA() {
        return "forward:/index.html";
    }
}
