<%
import java.sql.*;

String username=request.getParameter("user_name");
out.println(username);
String password=request.getParameter("pword");
out.println(password);
if (username == "admin" && password == "12345") {
out.print("Successful Login");
} else {
  out.println("Wrong Password");
}


public Boolean checkLogin(String username,String password){
  static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
    static final String DB_URL = "jdbc:mysql://localhost/STUDENTS";

}
%>
