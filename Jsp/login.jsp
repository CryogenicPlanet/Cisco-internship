<%
String username=request.getParameter("user_name");
out.println(username);
String password=request.getParameter("pword");
out.println(password);
if (username == null) {
out.print("Successful Login");
} else {
  out.println("Wrong Password");
}
%>
