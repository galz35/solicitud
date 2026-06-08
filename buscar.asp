<html>
<head>
<title>Solicitud de Empleo - B&uacute;squedas</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"/>
<link rel="stylesheet" type="text/css" href="css/estilo.css" />
<script type="text/javascript" src="js/funciones.js"></script>
<style type="text/css">
<!--
.Estilo1 {
	font-family: Verdana, Arial, Helvetica, sans-serif;
	font-size: 9pt;
	color: #D62818;
}
.Estilo4 {
	font-size: 8pt;
	font-family: Verdana, Arial, Helvetica, sans-serif;
	color: #D62818;
	font-weight: bold;
}
-->
.Estilo11 { font-family:  Arial, Verdana, Helvetica, sans-serif;
	font-size: 9pt; color: #666666; font-weight: bold; }
.Estilo12 {font-size: 12px}
.Estilo14 {color: #CC0000}
.Estilo15 {color: #D62818}
.Estilo16 {
	font-size: 14px;
	font-weight: bold;
}
a:link {
	text-decoration: none;
	color: #D62818;
}
a:visited {
	text-decoration: none;
}
a:hover {
	text-decoration: none;
	color: #990000;
}
a:active {
	text-decoration: none;
}
.Estilo18 {color: #D62818; font-size: 12px; }
.Estilo19 {font-family: Arial, Verdana, Helvetica, sans-serif; font-size: 18pt; color: #D62818; font-weight: bold; }
-->
</style>
<script type="text/javascript">
var tinac;
function ini() {
  tinac = setTimeout('location="solicitud.asp"',600000); // 30 segundos
}
function parar() {
  clearTimeout(tinac);
  tinac = setTimeout('location="solicitud.asp"',600000); // 30 segundos
}
function actualizar(){
window.location.reload();
}

function recarga_padre_y_cierra_ventana(){
window.opener.location.reload();
window.close();
opener.document.location="buscar.asp";
}
</script>


</head>
<body  onload="ini()" onkeypress="parar()" onclick="parar()">
<form method="post"  action="buscar.asp"  name ="frmact" >
<table width="100%" border="0" align="center">
	<tr bordercolor="#666666" bgcolor="#EFEBDE">
	<td height="41"  colspan="4"><div align="center" class="Estilo19"> BUSCAR REGISTRO DE SOLICITUD DE EMPLEO </div></td>
 </tr>
 	<tr align="right" bordercolor="#666666">
	    <td width="307" align="left" bgcolor="#EFEBDE"><span class="Estilo11">Nombre: </span> <input type="text"  align="right" name="nombre"  id="nombre"   size="50" maxlength="50"> </td>
		<td width="79" align="center" bgcolor="#EFEBDE"><input type="submit" name="Accion" class="btn" value="Consultar" tabindex="1"></td>
		<td width="511" align="right" bgcolor="#EFEBDE">   <input type="submit" name="Accion" class="btn" value="Salir" onClick="javascript:recarga_padre_y_cierra_ventana()" size="55" tabindex="3"></td>
    </tr>
			
 <table width="70%"  border="1" align="center">
	   <tr>
	   <th  colspan="5 " scope="col" align="center" valign="middle"><span class="Estilo11">Detalle de Registros</span></th>
	  </tr>
   <tr> 
 	<th width="38%" scope="col" align="center" valign="middle"><span class="Estilo11">Nombre Completo</span></th>
    <th width="12%" scope="col" align="center" valign="middle"><span class="Estilo11">C&eacute;dula</span></th>
	<th width="18%" scope="col" align="center" valign="middle"><span class="Estilo11"> Fecha</span> </th>
	<th width="13%" scope="col" align="center" valign="middle"><span class="Estilo11"> Acci&oacute;n</span> </th>
    </tr>
			  <%
   'Dim Conn,strSQL, objDF
   'DIM NOMBRES
   dim registros
   registros=0
   Set Conn = Server.CreateObject("ADODB.Connection")

   Conn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
   if session("candidato")="" then
   strSQL = "select PNOMBRE + ' ' + case when SNOMBRE is null then '' else SNOMBRE end + ' ' +  PAPELLIDO + ' ' + "
   strSQL= strSQL + "case when SAPELLIDO is null then '' else SAPELLIDO end  NOMBRE_COMPLETO, CEDULA,FECHA_SOL FECHA  from tbl_DGENERALES"
   strSQL= strSQL + " WHERE PNOMBRE<>'' ORDER BY PNOMBRE, SNOMBRE, PAPELLIDO, SAPELLIDO ASC"
   else
   strSQL = "select PNOMBRE + ' ' + case when SNOMBRE is null then '' else SNOMBRE end + ' ' +  PAPELLIDO + ' ' + "
   strSQL= strSQL + "case when SAPELLIDO is null then '' else SAPELLIDO end  NOMBRE_COMPLETO, CEDULA,FECHA_SOL FECHA  from tbl_DGENERALES "
   strSQL= strSQL + "WHERE PNOMBRE + ' ' + case when SNOMBRE is null then '' else SNOMBRE end + ' ' +  PAPELLIDO + ' ' + "
   strSQL= strSQL + "case when SAPELLIDO is null then '' else SAPELLIDO end LIKE'%" & session("candidato") & "' ORDER BY PNOMBRE, SNOMBRE, PAPELLIDO, SAPELLIDO ASC"
   'response.Write(strSQL)
   end if
   'response.Write(strSQL)
     Set objDF = Conn.Execute(strSQL)
     while (not objDF.Eof)
	  registros=registros + 1
	  cadena="<tr><td><span class=""Estilo12"">" & objDF("NOMBRE_COMPLETO") & "</span ></td><td><span class=""Estilo12"">" & objDF("CEDULA") & "</span ></td><td><span class=""Estilo12"">"& " " &objDF("FECHA") & "</span ></td>"
	  cadena=cadena & " <td><a href=""javascript:ventana('chcedula.asp?id="& objDF("cedula")&"&nombre="& objDF("NOMBRE_COMPLETO")&"')""<span class=""Estilo12"">Corregir Cedula</span ></a></td></tr>"
	  Response.Write(cadena)
      objDF.MoveNext
   wend
  Conn.Close
   set objRS = nothing
   set Conn = nothing
   
   if registros=0 then
   response.Write("<tr><td colspan=5> <center><span class=""Estilo11 Estilo14"">NO HAY COINCIDENCIAS</span></center></tr>")
   end if
  response.Write("<tr><td colspan=5> <center><span class=""Estilo11 Estilo14"">TOTAL DE REGISTROS:  " & registros & "</span></center></tr>")
%>
	 
   </table>
			
  </table>
</div>
</body>
</form >

<%
if Request.ServerVariables("REQUEST_METHOD") = "POST" then
Dim Accion,empleado
Accion = Request.Form("Accion")
session("candidato") = Request.Form("nombre")
   if Accion="Consultar" then
		response.redirect("buscar.asp")
   elseif Accion="Salir" then		
        Session.Abandon
 		Session.Contents.RemoveAll()
		response.redirect("index.asp")
	end if
end if	
%>


</html>
