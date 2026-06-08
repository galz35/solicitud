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
opener.document.location="solicitud.asp#dlaborales";

}

</script>
<% 
Dim Accion
Accion = Request("grabar_de")
 dim id
id=request.querystring("id")
Dim oConn,strSQL
   Set oConn = Server.CreateObject("ADODB.Connection")
   oConn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
   codigo=Request.Form("codemp")

if accion="Actualizar" then  
   if Request.Form("empresa" )<>"" and Request.Form("puesto")<>"" and Request.Form("area" ) <>"" then
	   strSQL="update  tbl_EProfesional set empresa='" &Request.Form("empresa" ) & "', puesto='" & Request.Form("puesto") &  "',"
	   strSQL= strSQL &  "area='"  & Request.Form("area" ) &"',  f_inicio='" & Request.Form("finicio" ) & "',"
	   strSQL= strSQL & "f_final='"  & Request.Form("ffin" )& "'," & "direccion='"  & Request.Form("direccion" )& "',"
	   strSQL= strSQL & "salario='"  & Request.Form("salario" )& "'," & "jefe_inmediato='"  & Request.Form("jefe" )& "',"
       strSQL= strSQL & "telefono='"  & Request.Form("telefono" )& "'," & "estado='"  & Request.Form("estado" )& "'"
	   strSQL= strSQL & "from tbl_EProfesional where id_ep='"& id & "'"
	   'response.write(strSQL)
	   oConn.Execute(strSQL)
	   oConn.Close
	   set oConn = nothing
     end if
elseif accion="Eliminar" then
     strSQL="delete from tbl_Eprofesional where id_ep='" & id & "'"
     'response.write(strSQL) 
     oConn.Execute(strSQL)
     oConn.Close
     set oConn = nothing 
end if 
  %> 
<body>
<body onLoad="recarga_padre_y_cierra_ventana()">

</body>
