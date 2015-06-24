package org.jetbrains.clientserver.server

import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse


WebServlet(name = "Hello", value = "/hello")
public class HomeController: HttpServlet() {
    override fun doGet(req: HttpServletRequest, resp: HttpServletResponse) {
        resp.getWriter().write("Hello, World!")
    }
}