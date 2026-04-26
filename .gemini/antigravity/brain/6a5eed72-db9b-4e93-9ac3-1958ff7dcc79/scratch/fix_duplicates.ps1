$path = "backend/smart-campus-api/src/main/java/com/smartcampus/ticket/service/TicketServiceImpl.java"
$content = Get-Content $path
$newContent = $content[0..240] + $content[285..($content.Length - 1)]
$newContent | Set-Content $path
