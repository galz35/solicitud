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
<title>Experiencia Profesional</title>
<% 
 dim id, msg
 id=request.querystring("id")

%>
<body >
<form method="post" action="saveep.asp?id=<%response.write(id)%>" name="frmeprofesional" style="border:0px ">

 <h2 class="Estilo19">  </h> </h2>
 <table width="335"  border="0" align="center">

 <%
   Dim Conn,strSQL, objDF
   DIM NOMBRES
   
   Set Conn = Server.CreateObject("ADODB.Connection")
  
   Conn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
   
   strSQL = "SELECT * FROM dbo.tbl_EProfesional"
   strSQL= strSQL & " where id_ep = '"& id & "'" 
  ' response.write (strSQL)
   Set objDF = Conn.Execute(strSQL)
      while (not objDF.Eof)
	  cod=objDF("cedula")
	  empresa=objDF("empresa")
	  puesto=objDF("puesto")
	  area=objDF("area")
	  inicio=objDF("f_inicio")
	  fin=objDF("f_final")
	  direccion=objDF("direccion")
	  salario=objDF("salario")
	  jefe=objDF("jefe_inmediato")
	  telefono=objDF("telefono")
	  estado=objDF("estado")
	 objDF.MoveNext
   wend
   
   Conn.Close
   set objRS = nothing
   set Conn = nothing
   'response.write (nivacad)
   
   
%>
<tr>
      <td colspan="2"><div align="center">Experiencia Profesional</div></td>
    </tr>
	<tr>
      <td colspan="2"><div align="center"><hr></div></td>
    </tr>
	<tr>
      <td colspan="2">Favor complete y/o actualice la informaci&oacute;n:</td>
      
   </tr>
     <tr>
      <td width="27%" >Empresa</td>
      <td><input type="text" name="empresa" id="empresa" size="35" onKeyUp="frmeprofesional.empresa.value=frmeprofesional.empresa.value.toUpperCase();"  onkeypress="return Valida_Dato(event,6)" value="<%response.write(empresa)%>" maxlength="150" class="txt"> </td>
   </tr>
    <tr>
      <td >Puesto</td>
      <td width="73%"><span class="Estilo19">
      <input type="text" name="puesto" id="puesto" size="35 " onKeyUp="frmeprofesional.puesto.value=frmeprofesional.puesto.value.toUpperCase();" onKeyPress="return Valida_Dato(event,6)" value="<%response.write(puesto)%>" maxlength="50" class="txt">
</span></td>
    </tr>
    <tr>
      <td>Area</td>
      <td><input type="text" name="area" id="area" size="35 " onKeyUp="frmeprofesional.area.value=frmeprofesional.area.value.toUpperCase();"  onKeyPress="return Valida_Dato(event,6)" value="<%response.write(area)%>" class="txt" ></td>
    </tr>
	<tr>
      <td>Fecha Inicio</td>
      <td><input type="text" name="finicio" id="finicio" size="15 " maxlength="10" onBlur="esFechaValida(this);" onkeypress="return Valida_Dato(event,5)" value="<%response.write(inicio)%>" class="txt" ></td>
	</tr>
	<tr>
      <td>Fecha Fin</td>
      <td><input type="text" name="ffin" id="ffin" size="15" maxlength="10" onBlur="esFechaValida(this);" onkeypress="return Valida_Dato(event,5)" value="<%response.write(fin)%>" class="txt"></td>
	</tr>
  <tr>
      <td>Direcci&oacute;n</td>
      <td><input type="text" name="direccion" id="direccion" size="45" maxlength="250" value="<%response.write(direccion)%>" class="txt" /></td>
  </tr>
	<tr>
      <td>Salario</td>
      <td><input type="text" name="salario" id="salario" size="15" maxlength="10"  value="<%response.write(salario)%>" class="txt"></td>
	</tr>
	<tr>
      <td>Jefe Inmediato </td>
      <td><input type="text" name="jefe" id="jefe" size="45" maxlength="50" value="<%response.write(jefe)%>" class="txt"></td>
	</tr>
	<tr>
      <td>Tel&eacute;fono</td>
      <td><input type="text" name="telefono" id="telefono" size="15" maxlength="10" value="<%response.write(telefono)%>" class="txt" /></td>
	</tr>
	<tr>
      <td>Estado</td>
      <td>  <select id="estado" name="estado" style="width:90px;font-family:Verdana,Geneva, sans-serif; font-size:10px;color: #456;">
          <option value=""></option>
          <option value="A" <%if estado="A" then %> selected <% END IF %>>Actual</option>
          <option value="U"<%if estado="U" then %> selected <% END IF %>>&Uacute;ltimo</option>
          <option value="P"<%if estado="P" then %> selected <% END IF %>>Pen&uacute;ltimo</option>
          <option value="AP"<%if estado="AP" then %> selected <% END IF %>>Antepen&uacute;ltimo</option>
        </select>            </td>
	</tr>
    
	<tr>
     
      <td colspan="2" align="center"><input name="grabar_de" type="submit"  class="btn2" value="Actualizar" /> 
	  <input name="grabar_de" type="submit"  class="btn2" value="Eliminar" /></td>
	</tr>
  </table>



</form>
</body>
</html>

