<?php
echo '<meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/><meta http-equiv="refresh" content="5; url=http://sitestile.net.ua/">';
$name = $_POST['contactname'];
$phone = $_POST['contacttelefon'];
$email = $_POST['contactmail'];
$subject = $_POST['subj'];
$REMOTE_ADDR = $_POST['REMOTE_ADDR'];
$message = "Имя пославшего письмо: $name\nТелефон:$phone\nEmail: $email\nIP-адрес: $_SERVER[REMOTE_ADDR]";

$to = "santa_dj@mail.ru";
mail ($to,$subject,$message,"Content-type:text/plain; charset = utf-8") or print "Не могу отправить письмо !!!";
echo "<div style='width:960px;margin: 0 auto;'>
    <div style='width: 618px; height: 240px; color: #111111; font-family: 'PFAgoraSlabPro';font-size: 18px; line-height: 18px;'>
        <div style='margin: 20;border:1px dashed #282828;border-radius:8px;padding:10px;margin-left:370px;'>
            <p>Спасибо за запрос, наш оператор свяжется с вами в ближайшее время!</p>
            <p>Через 5 сек. вы будете перенаправлены на главную страницу.</p>
        </div>
    </div>
</div>
";
exit;
?>