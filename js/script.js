const previewImage = (_input, _preview) => {
    // preview image
    const ipnFileElement = document.querySelector(_input);
    const resultElement = document.querySelector(_preview);

    ipnFileElement.onchange = (evt) => {
        const [file] = ipnFileElement.files;
        if (file) {
            resultElement.src = URL.createObjectURL(file);
        } else {
            resultElement.src = './images/default.png';
        }
    };
};

const clearAll = () => {
    $('input,textarea').val('');
    $('img').attr('src', './images/default.png');
    $('#download').attr('href', '#');
};

const handleEncrypt = () => {
    let ciphertext = CryptoJS.AES.encrypt(
        $('#mes-encrypt').val(),
        $('#encrypt-key').val()
    ).toString();
    $('#mes-encrypted').val(ciphertext);
};

const handleHide = () => {
    let original = document.querySelector('.preview-original'),
        cover = document.querySelector('.preview-hidden'),
        download = document.getElementById('download');
    // ciphertext = document.getElementById('mes-encrypted'),
    let ciphertext = CryptoJS.AES.encrypt(
        $('#mes-encrypt').val(),
        $('#encrypt-key').val()
    ).toString();
    if (original && ciphertext) {
        cover.src = steg.encode(ciphertext, original);
        // cover.src = steg.encode(ciphertext.value, original);
        download.download = 'encoded_image.png';
        download.href = cover.src.replace('image/png', 'image/octet-stream');
    }
};

const handleShow = () => {
    const key = $('#decrypt-key').val();
    var img = document.querySelector('.preview-encrypted'),
        message = document.querySelector('#mes-decrypted');
    if (img) {
        let ciphertext = steg.decode(img);
        let bytes = CryptoJS.AES.decrypt(ciphertext, key);
        let originalText = bytes.toString(CryptoJS.enc.Utf8);
        message.innerHTML = originalText;
    }
};

const handleSend = () => {
    $('#decrypt-key').val($('#encrypt-key').val());
    $('.preview-encrypted').attr('src', $('.preview-hidden').attr('src'));
};

const handleGenerate = () => {
    var salt = CryptoJS.lib.WordArray.random(128 / 8);
    $('#encrypt-key').val(
        CryptoJS.PBKDF2('pass123', salt, {
            keySize: 512 / 32,
            iterations: 1000,
        })
    );
};

$(document).ready(function () {
    previewImage('#img-encrypt', '.preview-original');
    previewImage('#img-decrypt', '.preview-encrypted');
    $('#clr-btn').click(clearAll);
    // $('#encrypt-mes-btn').click(handleEncrypt);
    $('#hide-btn').click(handleHide);
    $('#show-btn').click(handleShow);
    $('#send-btn').click(handleSend);
    $('#generate-btn').click(handleGenerate);
});
