<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<link rel="stylesheet" type="text/css" href="css/estilo.css" />
<script type="text/javascript" src="js/funciones.js"></script>
<title>Solicitud de Empleo</title>
<style type="text/css">
<!--
body,td,th {
	color: #000;
}
body {
	background-color: #D62818;
}
-->
</style>
	
</head>



<body>
 <input type="hidden" name="acciones" value="">
 
    <center>
      <img src="img/Encab.png" />       </center>
<form method="post"  style="border:0px " action="index.asp"  name ="frmsolicitud" >
  <input type="hidden" name="acciones" value="">
  
  <div id="contenido"  >
<div id="dgenerales" >
  <p>&nbsp;</p>
  <p>&nbsp;</p>
  <p>&nbsp;</p>

  <table align="center"  width="32%"  border="0">
    <tr> 
	<td colspan="2" align="center" height="40" > INGRESE NUMERO DE CEDULA </td>
	</tr>
		<tr>
       <td width="171" >C&eacute;dula</td>
        <td width="266"   ><input type="Text" name="cedula" id="cedula" class="txt" size="25" maxlength="14" onkeypress="return Valida_Dato(event,7)" onKeyUp="frmsolicitud.cedula.value=frmsolicitud.cedula.value.toUpperCase();"></td>
  
    </tr>
    <tr>
      <td>Acci&oacute;n</td>
      <td><select id="accion" name="accion"  style="font-family:Verdana, Geneva, sans-serif; font-size:10px;width:140px;color: #456;">
       <option value=""  ></option>
	   <option value="A" >Registrar</option>
       <option value="I" >Imprimir</option>
	   <option value="C" >Consultar</option>
        </select> </td>
    </tr>
	 <tr>
     
      <td colspan="2" align="center" height="40"><input name="Submit" type="Submit"  class="btn"  value="ENTRAR"></td>
    </tr>
	  <%
if Request.ServerVariables("REQUEST_METHOD") = "POST" then
Dim Accion,sqlstring,mensaje
DIM oConn, sql, DG, DE
'Response.Write "Bienvenido <B>"& Session("cedula") &"</B>"

Accion = Request.Form("Accion")
session("cedula")=request.Form("cedula")
if request.form("cedula")="" and request.form("Accion")<>"C" then
  Response.Redirect("index.asp")	
elseif accion="A" then
                 Response.Redirect("solicitud.asp")	
elseif accion="I" then
		Set oConn = Server.CreateObject ("ADODB.Connection")
		oConn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
		sql = "SELECT * FROM tbl_DGenerales WHERE cedula = '"& Session("cedula") &"'" ' Recuperar los valores que se encuentran registrados
		Set DG = Server.CreateObject ("ADODB.RecordSet")
		dg.Open sql, oConn
		'response.write(session("cedula"))
		If (DG.EOF =TRUE) then %>
		 <tr> <td colspan="2" align="center" height="25">!!!REGISTRO NO EXISTE!!!</td> </tr>
		<% else
		Response.Redirect("imp_solicitud.asp")	
		end if
elseif accion="C" then
                 Response.Redirect("buscar.asp")	
elseif accion="Salir" then
 	Session.Abandon
 	Session.Contents.RemoveAll()
 	Response.Redirect("index.asp")
end if
 
end if
%>
	
  </table>
 
</div>
</div>

</form >	
</body>
</html>
