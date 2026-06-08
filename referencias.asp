<%
'Comprobar que está autorizado
IF IsEmpty(session("cedula")) then
'No está autorizado
response.redirect "index.asp"
end if

'Lo demas solo lo recibe el cliente autorizado, y recibe solo las copias de las variables de session que le pertenecen...
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>

<script type="text/javascript" src="js/funciones.js"></script>
<link rel="stylesheet" type="text/css" href="css/estilo.css" />
</head>
<title>Experiencia Profesional</title>
<% 
 dim id, ms
 id=request.querystring("id")
 ms= request.querystring("msg")
%>
<body >
<form method="post" action="saveref.asp?interno='N'&id=<%response.write(id)%>" name="frmeprofesional" style="border:0px ">

 <h2 class="Estilo19">  </h> </h2>
 <table width="335"  border="0" align="center">

 <%
   Dim Conn,strSQL, objDF
   DIM NOMBRES
   
   Set Conn = Server.CreateObject("ADODB.Connection")
  
   Conn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
   
   strSQL = "SELECT id_ref, cedula, nombre_completo, direccion, empresa, edad,telefono FROM dbo.tbl_referencias"
   strSQL= strSQL & " where id_ref = '"& id & "'" 
  ' response.write (strSQL)
   Set objDF = Conn.Execute(strSQL)
    while (not objDF.Eof)
	  	cod=objDF("cedula")
	  	nombre=objDF("nombre_completo")
	  	direccion=objDF("direccion")
	  	empresa=objDF("empresa")
	  	edad=objDF("edad")
		telefono=objDF("telefono")
	  	objDF.MoveNext
   	wend
   Conn.Close
   set objRS = nothing
   set Conn = nothing

if ms="E" then
%>

<tr>
      <td colspan="2"><div align="center"><span class="Estilo21">Referencias</span></div></td>
    </tr>
	<tr>
      <td colspan="2"><div align="center"><hr></div></td>
    </tr>
	<tr>
      <td colspan="2"><span class="Estilo18">Favor complete y/o actualice la informaci&oacute;n:</span></td>
    </tr>
     <tr>
      <td width="41%" ><span class="Estilo16">Nombre Completo </span></td>
      <td><input type="text" name="nombre1" id="nombre1" size="35" onKeyUp="frmeprofesional.empresa.value=frmeprofesional.empresa.value.toUpperCase();"  onkeypress="return Valida_Dato(event,6)" value="<%response.write(nombre)%>" maxlength="85" class="txt" > </td>
   </tr>
    <tr>
      <td ><span class="Estilo16">Direcci&oacute;n</span></td>
      <td width="59%"><span class="Estilo19">
      <input type="text" name="direccion" id="direccion" size="35" onKeyUp="frmeprofesional.puesto.value=frmeprofesional.puesto.value.toUpperCase();" onKeyPress="return Valida_Dato(event,6)" value="<%response.write(direccion)%>" maxlength="250" class="txt" >
      </span></td>
    </tr>
    <tr>
      <td><span class="Estilo16">Empresa</span></td>
      <td><input type="text" name="empresa" id="empresa" size="35" onKeyUp="frmeprofesional.area.value=frmeprofesional.area.value.toUpperCase();"  onKeyPress="return Valida_Dato(event,6)" value="<%response.write(empresa)%>" maxlength="100" class="txt"></td>
    </tr>
	<tr>
      <td><span class="Estilo16">Edad</span></td>
      <td><input type="text" name="edad" id="edad" size="15" maxlength="2"  value="<%response.write(edad)%>"class="txt" ></td>
	</tr>
	<tr>
      <td><span class="Estilo16">Tel&eacute;fono</span></td>
      <td><input type="text" name="telefono" id="telefono" size="15" maxlength="10" value="<%response.write(telefono)%>" class="txt"></td>
	</tr>
  
    
	<tr>
     
      <td colspan="2" align="center"><input name="grabar_ref" type="submit" class="btn2" value="Actualizar" />
	  <input name="grabar_ref" type="submit" class="btn2" value="Eliminar" /></td>
	</tr>
<% else %>
<tr>
      <td colspan="2"><div align="center"><span class="Estilo21">Referencias</span></div></td>
    </tr>
	<tr>
      <td colspan="2"><div align="center"><hr></div></td>
    </tr>
	<tr>
      <td colspan="2"><span class="Estilo18">Favor complete y/o actualice la informaci&oacute;n:</span></td>
    </tr>
     <tr>
      <td width="41%" ><span class="Estilo16">Nombre Completo </span></td>
      <td><input type="text" name="nombre2" id="nombre2" size="35" onKeyUp="frmeprofesional.empresa.value=frmeprofesional.empresa.value.toUpperCase();"  onkeypress="return Valida_Dato(event,6)" value="<%response.write(nombre)%>" maxlength="150" class="txt" > </td>
   </tr>
    
  
	<tr>
      <td><span class="Estilo16">Edad</span></td>
      <td><input type="text" name="edad2" id="edad2" size="15" maxlength="10"  value="<%response.write(edad)%>"class="txt" ></td>
	</tr>
	<tr>
      <td><span class="Estilo16">Tel&eacute;fono</span></td>
      <td><input type="text" name="telefono2" id="telefono2" size="15" maxlength="10" value="<%response.write(telefono)%>" class="txt"></td>
	</tr>
  
    
	<tr>
     
      <td colspan="2" align="center"><input name="grabar_ref" type="submit" class="btn2" value="Grabar" />
	  <input name="grabar_ref" type="submit" class="btn2" value="Eliminar" /></td>
	</tr>


  

<%end if%>
</table>

</form>
</body>
</html>

