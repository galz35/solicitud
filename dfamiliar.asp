<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<script type="text/javascript" src="js/funciones.js"></script>
<link rel="stylesheet" type="text/css" href="css/estilo.css" />

</head>
<title>Datos Familiares</title>
<% 
 dim id, msg
 id=request.querystring("id")
 msg=request.querystring("msg")
%>

<form method="post" action="savedf.asp?id=<%response.write(id)%>" name="frmdfamiliar" style="border:0px ">
<%if msg="P" then%>

 <table width="54%" height="345"  border="0" align="center">
 <%
   Dim Conn,strSQL, objDF
   DIM NOMBRES
   
   Set Conn = Server.CreateObject("ADODB.Connection")
  
   Conn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
   
   strSQL = "SELECT a.id_df,b.cod_parentesco,b.descripcion, a.cedula, a.Nombres, a.Apellidos, a.ocupacion, a.F_Nacimiento, a.direccion, a.depende, a.l_trabajo FROM tbl_DFamiliares a,"
   strSQL= strSQL & " tbl_parentesco b where  b.cod_parentesco=a.parentesco and  a.id_df = '"& id & "'" 
   'response.write (strSQL)
  Set objDF = Conn.Execute(strSQL)
     while (not objDF.Eof)
	  cod=objDF("cedula")
	  idparent=objDF("cod_parentesco")
	  parentesco=objDF("descripcion")
	  nombres=objDF("nombres")
	  apellidos=objDF("apellidos")
	  ocupacion=objDF("ocupacion")
	  l_trabajo=objDF("l_trabajo")
	  f_nac=objDF("f_nacimiento")
	  direccion=objDF("direccion")
	  depende=objDF("depende")
      objDF.MoveNext
   wend
   
   Conn.Close
   set obJDF = nothing
   set Conn = nothing
  '  if cod=Session("codemp") then
    'response.write ("Registro Permitido")
  ' else
  '  response.redirect ("login.asp")
  ' end if	
%>  
	<tr>
      <td colspan="2"><div align="center"><span class="Estilo18"><span class="Estilo21">Datos Familiares</span></span></div></td>
    </tr>
	<tr>
      <td colspan="2"><div align="center"><hr></div></td>
    </tr>
	<tr>
      <td colspan="2"><span class="Estilo18">Favor complete y/o actualice la informaci&oacute;n:</span></td>
      
   </tr>
  <!-- <tr> 
      <td ><span class="Estilo16">No. Empleado </span></td>
      <td><input type="text" name="codemp" id="codemp" value="<%response.write(cod)%>" > </td>
   </tr>  -->
    <tr>
      <td>Parentesco</td>
      <td ><select name="parentesco" id="parentesco" style="font-family:Verdana, Geneva, sans-serif; font-size:10px;width:140px;color: #456;" >
        <%
		   Dim Conp,qry, objp
		   Set Conp = Server.CreateObject("ADODB.Connection")
		   Conp.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
		   qry = "SELECT * FROM tbl_Parentesco order by descripcion"
		   Set objp = Conp.Execute(qry)
			while (not objp.Eof)%>
        <option value= <%response.write(objp("cod_parentesco"))%> <%if idparent=objp("cod_parentesco") then %> selected <% END IF %> >
        <%response.write(objp("descripcion"))%>
        </option>
        <% objp.MoveNext
		   wend
		   Conp.Close
		   set objp = nothing
		   set Conp = nothing
       %>
      </select></td>
    </tr>
    <tr>
      <td>Nombres</td>
      <td><input type="text" name="Nombre_fam" id="Nombre_fam2" onKeyUp="frmdfamiliar.Nombre_fam.value=frmdfamiliar.Nombre_fam.value.toUpperCase();" onKeyPress="return Valida_Dato(event,6)"  size="35 " value="<%response.write(nombres)%>" class="txt" maxlength="50"></td>
    </tr>
	<tr>
      <td>Apellidos</td>
      <td><input type="text" name="Apell_fam" id="Apell_fam" onKeyUp="frmdfamiliar.Apell_fam.value=frmdfamiliar.Apell_fam.value.toUpperCase();" onkeypress="return Valida_Dato(event,6)" size="35 "value="<%response.write(apellidos)%>" class="txt" maxlength="50"></td>
    </tr>
    <tr>
      <td>Ocupaci&oacute;n</td>
      <td><input type="text" name="ocupacion" id="ocupacion" onKeyUp="frmdfamiliar.ocupacion.value=frmdfamiliar.ocupacion.value.toUpperCase();" class="txt" onkeypress="return Valida_Dato(event,6)" size="35 "value="<%response.write(ocupacion)%>" maxlength="50"></td>
    </tr>
	 <tr>
      <td>Lugar de Trabajo</td>
      <td><input type="text" name="ltrabajo" id="ltrabajo" onKeyUp="frmdfamiliar.ltrabajo.value=frmdfamiliar.ltrabajo.value.toUpperCase();" class="txt" onkeypress="return Valida_Dato(event,6)" size="35 "value="<%response.write(l_trabajo)%>" maxlength="50"></td>
    </tr>
    <tr>
      <td>
        <label for= "label2">Fecha Nacimiento</label>
      </td>
      <td>    <input type="text" name="fecnac_fam" id="fecnac_fam" value="<%response.write(f_nac)%>" onKeyPress="return Valida_Dato(event,5)" class="txt" onBlur="esFechaValida(this);"  size="20 " maxlength="10">  </td>
    </tr>
    <tr>
      <td>Direcci&oacute;n</td>
      <td><input type="text" name="direccion" id="direccion" onKeyUp="frmdfamiliar.direccion.value=frmdfamiliar.direccion.value.toUpperCase();" onkeypress="return Valida_Dato(event,6)" size="60 "value="<%response.write(direccion)%>" class="txt" maxlength="50">      
    </tr>
    <tr>
      <td>Depende(S/N)</td>
      <td><input type="text" name="depende" id="depende" onKeyUp="frmdfamiliar.Apell_fam.value=frmdfamiliar.Apell_fam.value.toUpperCase();" onkeypress="return Valida_Dato(event,6)"  size="35" value="<%response.write(depende)%>" class="txt" maxlength="1">
</td>
    </tr>
	
     <tr align="center"> 
	  <td colspan="2"><input name="grabar_df" type="submit"  class="btn2" value="Actualizar" >
	    <input name="grabar_df" type="submit"  class="btn2" value="Eliminar" /> </td>
    </tr>
	
  </table>

<% end if%> 
</form>
</html>

