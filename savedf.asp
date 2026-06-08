<%
'Comprobar que está autorizado
IF IsEmpty(session("cedula")) then
'No está autorizado
response.redirect "login.asp"
end if
'Lo demas solo lo recibe el cliente autorizado, y recibe solo las copias de las variables de session que le pertenecen...
%>

<script language=JavaScript >

function recarga_padre_y_cierra_ventana(){
window.opener.location.reload();
window.close();
opener.document.location="solicitud.asp#dfamiliares";

}

</script>
<% 
Dim Accion
Accion = Request("grabar_df")
 dim id
 id=request.querystring("id")
Dim oConn,strSQL
   Set oConn = Server.CreateObject("ADODB.Connection")
   oConn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
   codigo=Request.Form("codemp")
   
 if accion="Actualizar" then   
   if 	Request.Form("Parentesco" )<>"N" and Request.Form("Nombre_fam")<>"" and Request.Form("Apell_fam" )<>"" then
   strSQL="update  tbl_dfamiliares set parentesco='" & Request.Form("Parentesco" ) & "', nombres='" & Request.Form("Nombre_fam") &  "',"
   strSQL= strSQL &  "apellidos='"  & Request.Form("Apell_fam" ) &"', ocupacion='" & Request.Form("ocupacion" ) & "',"
   strSQL= strSQL & "f_nacimiento='" & Request.Form("fecnac_fam" ) &  "', direccion='" & Request.Form("direccion" ) &"', depende='"& Request.Form("depende") & "',"
   strSQL= strSQL & "l_trabajo='" & Request.Form("ltrabajo" )& "' from tbl_dfamiliares where id_df='"& id & "'"
   'response.write(strSQL)
   oConn.Execute(strSQL)
   oConn.Close
   set oConn = nothing
  end if  
 elseif accion="Eliminar" then
  strSQL="delete from tbl_Dfamiliares where id_df='" & id & "'"
  'response.write(strSQL) 
  oConn.Execute(strSQL)
   oConn.Close
   set oConn = nothing
end if%>
<body>
<body onLoad="recarga_padre_y_cierra_ventana()">
</body>
