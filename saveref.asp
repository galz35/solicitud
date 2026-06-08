<%
'Comprobar que está autorizado
IF IsEmpty(session("cedula")) then
'No está autorizado
response.redirect "index.asp"
end if
'Lo demas solo lo recibe el cliente autorizado, y recibe solo las copias de las variables de session que le pertenecen...
%>

<script language=JavaScript >

function recarga_padre_y_cierra_ventana(){
window.opener.location.reload();
window.close();
opener.document.location="solicitud.asp#referencias";

}

</script>
<% 
Dim Accion
Accion = Request("grabar_ref")
 dim id,interno
 id=request.querystring("id")
response.Write(Accion)
Dim oConn,strSQL
   Set oConn = Server.CreateObject("ADODB.Connection")
   oConn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"

if Accion="Actualizar" then
	   strSQL="update  tbl_referencias set nombre_completo='" & Request.Form("nombre1" ) & "', direccion='" & Request.Form("direccion") &  "',"
	   strSQL= strSQL &  "empresa='"  & Request.Form("empresa" ) &"',  edad='" & Request.Form("edad" ) & "',"
	   strSQL= strSQL & "telefono='"  & Request.Form("telefono" )& "'"
	   strSQL= strSQL & "from tbl_referencias where id_ref='"& id & "'"
	   response.write(strSQL)
	   oConn.Execute(strSQL)
	   oConn.Close
	   set oConn = nothing
elseif Accion="Grabar" then
	   strSQL="update  tbl_referencias set nombre_completo='" &Request.Form("nombre2" ) & "', edad='" & Request.Form("edad2") &  "',"
	   strSQL= strSQL & "telefono='"  & Request.Form("telefono2" )& "'"
	   strSQL= strSQL & "from tbl_referencias where id_ref='"& id & "'"
	   'response.write(strSQL)
	   oConn.Execute(strSQL)
	   oConn.Close
	   set oConn = nothing
	   
elseif Accion="Eliminar" then
	  
	   strSQL= "delete from tbl_referencias where id_ref='"& id & "'"
	   'response.write(strSQL)
	   oConn.Execute(strSQL)
	   oConn.Close
	   set oConn = nothing
end if


%>
  
<body>
<body onLoad="recarga_padre_y_cierra_ventana()">
</body>
