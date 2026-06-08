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
<link rel="stylesheet" type="text/css" href="css/estilo.css" />
<script type="text/javascript" src="js/funciones.js"></script>

</head>
<title>Informacion Academica</title>
<% 
 dim id, msg
 id=request.querystring("id")
 msg=request.querystring("msg")
%>

<form method="post" action="saveda.asp?id=<%response.write(id)%>" style="border:0px ">
<%if msg="DA" then%>
<table  border="0" align="center">

 <%
   Dim Conn,strSQL, objDF
   DIM NOMBRES
   
   Set Conn = Server.CreateObject("ADODB.Connection")
  
   Conn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
   
   strSQL = "SELECT a.id_da,a.cedula,a.nivel_academico,a.titulo,a.estado,a.ult_ano_aprob,a.institucion,duracion FROM tbl_DAcademicos a"
   strSQL= strSQL & " where a.id_da = '"& id & "'" 
   'response.write (strSQL)
   Set objDF = Conn.Execute(strSQL)
      while (not objDF.Eof)
	  cod=objDF("cedula")
	  nivacad=objDF("nivel_academico")
	  titulo=objDF("titulo")
	  ano_aprob=objDF("ult_ano_aprob")
	  estado=objDF("estado")
	  institucion=objDF("institucion")
	  duracion=objDF("duracion")
	 objDF.MoveNext
   wend
   
   Conn.Close
   set objRS = nothing
   set Conn = nothing
   'response.write (nivacad)
    
%>
<td colspan="2"><div align="center"><span class="Estilo21">Informaci&oacute;n Acad&eacute;mica</span></div></td>
    </tr>
	<tr>
      <td colspan="2"><div align="center"><hr></div></td>
    </tr>
	<tr>
      <td colspan="2" height="35"><span class="Estilo18">Favor complete y/o actualice la informaci&oacute;n:</span></td>
      
   </tr>
   <!-- <tr>
      <td ><span class="Estilo16">No. Empleado </span></td>
      <td><input type="text" name="codemp" id="codemp" value="<%response.write(cod)%>" > </td>
   </tr>  -->
    <tr>
      <td ><span class="Estilo16">Nivel Académico</span></td>
      <td width="62%"><select name="nacad" id="nacad" style="font-family:Verdana, Geneva, sans-serif; font-size:10px;width:140px;color: #456;" >
        <option value="" <% if nivacad= "" then %> selected <% end if %> ></option>
        <option value="P"  <% if nivacad= "P" then %> selected <% end if %> >Primaria</option>
        <option value="S" <% if nivacad= "S" then %> selected <% end if %> > Secundaria</option>
        <option value="T"  <% if nivacad= "T" then %> selected <% end if %> >T&eacute;cnico</option>
        <option value="U"  <% if nivacad= "U" then %> selected <% end if %> >Universidad</option>
        <option value="Pg" <% if nivacad= "Pg" then %> selected <% end if %> >Postgrado </option>
        <option value="M"  <% if nivacad= "M" then %> selected <% end if %> >Maestr&iacute;a</option>
        <option value="D"  <% if nivacad= "D" then %> selected <% end if %> >Doctorado</option>
      </select >  </td>
    </tr>
    <tr>
      <td><span class="Estilo16">Título Obtenido</span></td>
      <td><input type="text" name="titulo" id="titulo" size="35 " value="<%response.write(titulo)%>" class="txt" maxlength="50" ></td>
    </tr>
	<tr>
      <td><span class="Estilo16">&Uacute;ltimo a&ntilde;o aprobado</span></td>
      <td><select name="anoaprob" id="anoaprob" style="font-family:Verdana, Geneva, sans-serif; font-size:10px;width:140px;color: #456;" >
        <option value="" <% if ano_aprob= "" then %> selected <% end if %> ></option>
        <option value="1º" <% if ano_aprob= "1º" then %> selected <% end if %> >Primero</option>
        <option value="2º" <% if ano_aprob= "2º" then %> selected <% end if %> >Segundo</option>
        <option value="3º" <% if ano_aprob= "3º" then %> selected <% end if %> >Tercero</option>
		<option value="4º" <% if ano_aprob= "4º" then %> selected <% end if %> >Cuarto</option>
        <option value="5º" <% if ano_aprob= "5º" then %> selected <% end if %> >Quinto</option>
        <option value="6º" <% if ano_aprob= "6º" then %> selected <% end if %> >Sexto</option>
      </select>
 
	  </td>
    </tr>
	<tr>
      <td><span class="Estilo16">Estado</span></td>
      <td><select name="estado" id="estado" style="font-family:Verdana, Geneva, sans-serif; font-size:10px;width:140px;color: #456;" >
        <option value="" <% if estado= "" then %> selected <% end if %> ></option>
        <option value="10" <% if estado= "10" then %> selected <% end if %> >Incompleto</option>
        <option value="20" <% if estado= "20" then %> selected <% end if %> >Completo</option>
        <option value="30" <% if estado= "30" then %> selected <% end if %> >En Curso</option>
        <option value="40" <% if estado= "40" then %> selected <% end if %> >Egresado</option>
        <option value="50" <% if estado= "50" then %> selected <% end if %> >Titulado</option>
        <option value="70" <% if estado= "70" then %> selected <% end if %> >Bajo</option>
        <option value="80" <% if estado= "80" then %> selected <% end if %> >Medio</option>
        <option value="90" <% if estado= "90" then %> selected <% end if %> >Alto</option>
      </select></td>
	</tr>
    <tr>
      <td><span class="Estilo16">Instituci&oacute;n Educativa</span></td>
      <td><input type="text" name="institucion" id="institucion" size="35 "value="<%response.write(institucion)%>" maxlength="250" onkeypress="return Valida_Dato(event,6)" class="txt"></td>
    </tr>
     <tr>
      <td><span class="Estilo16">Duraci&oacute;n</span></td>
      <td><input type="text" name="duracion" id="duracion" size="35 "value="<%response.write(duracion)%>" maxlength="250" onkeypress="return Valida_Dato(event,9)" class="txt"></td>
    </tr>
	<tr>
     
      <td  colspan="2" align="center" height="35"><input name="grabar_da" type="submit" class="btn2"  value="Actualizar">
	  <input name="grabar_da" type="submit" class="btn2" value="Eliminar"></td>
    </tr>
  </table>



<%end if%> 
</form>
</html>

