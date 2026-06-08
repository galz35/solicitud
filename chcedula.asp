<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="stylesheet" type="text/css" href="css/estilo.css" />
<script type="text/javascript" src="js/funciones.js"></script>
<script language=JavaScript >

function recarga_padre_y_cierra_ventana(){
window.opener.location.reload();
window.close();
opener.document.location="imp_solicitud.asp";
}

</script>
</head>
<title>Cambio de C&eacute;dula</title>
<% 
 dim id, msg
 cedula=request.querystring("id")
 nombre=request.querystring("nombre")
%>
<form method="post" action="chcedula.asp" style="border:0px"  name ="frmcedula">
<table  border="0" align="center">
 <td colspan="2"><div align="center"><span class="Estilo21">Correcci&oacute;n de C&eacute;dula </span></div></td>
    </tr>
	<tr>
      <td colspan="2"><div align="center"><%response.write(nombre)%></div></td>
    </tr>
	<tr>
      <td colspan="2" height="35"><span class="Estilo18">Favor complete en el campo Nueva C&eacute;dula y seleccione el bot&oacute;n actualizar:</span></td>
     </tr>
    <tr>
      <td><span class="Estilo16">C&eacute;dula anterior </span></td>
      <td><input type="text" name="acedula" id="acedula" size="35 " value="<%response.write(cedula)%>" class="txt" readonly="readonly" maxlength="50" /></td>
    </tr>
	
    <tr>
      <td><span class="Estilo16">Nueva C&eacute;dula</span></td>
      <td><input type="text" name="chcedula" id="chcedula" size="35 " value="" maxlength="14" onkeypress="return Valida_Dato(event,7)" onKeyUp="frmcedula.chcedula.value=frmcedula.chcedula.value.toUpperCase();" class="txt"></td>
    </tr>
  
	<tr>
     
      <td  colspan="2" align="center" height="35"><input name="grabar" type="submit" class="btn2"  value="Actualizar">
	  <input name="grabar" type="submit" class="btn2" value="Cerrar"></td>
    </tr>
  </table>
</form>

<%
if Request.ServerVariables("REQUEST_METHOD") = "POST" then
Dim Accion,empleado, sql, acedula, chcedula
Accion = Request.Form("grabar")
acedula=request.form("acedula")
chcedula=request.form("chcedula")
session("cedula")=chcedula
   if Accion="Actualizar" then
		   if chcedula<>"" then
					Set Conn = Server.CreateObject("ADODB.Connection")
					Conn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
					sql= "update tbl_dgenerales set cedula='" & chcedula & "' where cedula='"& acedula & "'"
					Conn.Execute(sql)	
					sql= "update tbl_dacademicos set cedula='" & chcedula & "' where cedula='"& acedula & "'"
					Conn.Execute(sql)	
					sql= "update tbl_dfamiliares set cedula='" & chcedula & "' where cedula='"& acedula & "'"
					Conn.Execute(sql)	
					sql= "update tbl_eprofesional set cedula='" & chcedula & "' where cedula='"& acedula & "'"
					Conn.Execute(sql)	
					sql= "update tbl_Referencias set cedula='" & chcedula & "' where cedula='"& acedula & "'"
					Conn.Execute(sql)	
					sql= "update tbl_RelaBanco set cedula='" & chcedula & "' where cedula='"& acedula & "'"
					Conn.Execute(sql)	
					sql= "update tbl_relaidiomas set cedula='" & chcedula & "' where cedula='"& acedula & "'"
					Conn.Execute(sql)	
					conn.close
					%>
					<SCRIPT LANGUAGE="JavaScript">
					window.alert("Registro Actualizado");
					recarga_padre_y_cierra_ventana()
					</SCRIPT>
					<%
			else%>
					<SCRIPT LANGUAGE="JavaScript">
					window.alert("Favor complete los datos de nueva cédula");
					window.close();
					</SCRIPT>
					<%
		   end if		
		elseif Accion="Cerrar" then %>
				<SCRIPT LANGUAGE="JavaScript">
					
					recarga_padre_y_cierra_ventana()
				</SCRIPT>
<%	end if
end if	
%>

</html>

