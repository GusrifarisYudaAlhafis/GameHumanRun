let game;
let orang;
let nyawa;
let infoNyawa;
let totalNyawa = 3;
let frameMotor;
let motor = false;
let durasi = 500;
let timerBikinMotor = false;
let timerCollision = false;
let papanNilai;
let nilai;
let strNilai = 0;
let info;
let namaGame;
let instruksi;
let strNamaGame = 'PENEROBOS TROTOAR';
let strInstruksi = 'TEKAN (space) untuk mulai dan lompat, tekan (p) untuk pause';
let aturOrang = {'lebar' : 50, 'tinggi' : 80};

function range(min, max) {
 	durasi = Math.floor(Math.random() * (max-min+1) + min);
 	return durasi;
}

function motorSudahAda() {
	if (motor !== false) {
		return true;
	}
	return false;
}

function pause() {
	game.addClass('pause');
	orang.addClass('pause');
	tampilkanInfo();
	if (motorSudahAda()) {
		motor.addClass('pause');
		window.clearTimeout(timerBikinMotor);
		window.clearTimeout(timerCollision);
	}
}

function jalan() {
	intervalMotor();
	game.removeClass('pause');
	orang.removeClass('pause');
	if (motorSudahAda()) {
		motor.removeClass('pause');
	}
	setTimeout(collisionMotor, 1000);
}

function hapusMotor() {
	motor.on("animationend", function() {
	    $(this).remove();
	});
}

function lompat() {
	orang.addClass('lompat');
	orang.on("animationend", function() {
	    $(this).removeClass("lompat");
	});
}

function tampilkanNyawa() {
	return infoNyawa.animate({'top' : '10'}, 1000).promise();
}

function tampilkanInfo() {
	return info.animate({'top' : '25'}, 1000).promise();
}

function hilangkanInfo() {
	return info.animate({'top' : '-150'}, 1000).promise();
}

function tampilkanPapanNilai() {
	return papanNilai.animate({'top' : '100'}, 700).promise();
}

function mati() {
	totalNyawa -= 1;
	$('#infoNyawa :last-child').remove();
	game.addClass('pause');
	orang.addClass('mati');
	if (totalNyawa == 0) {
		tampilkanInfo();
		game.addClass('reset');
	} else {
		game.addClass('lanjutMain');
	}
}

function lanjutMain() {
	game.removeClass('lanjutMain');
	game.removeClass('pause');
	orang.removeClass('mati');
	$('.belumLewat').addClass('tantangan');
}

function reset() {
	location.reload();
}

function collisionMotor() {
	timerCollision = setTimeout(function() {
						motor.each(function(index, obj) {
								let posOrang = { 'lebar'	: orang.width(),
												 'tinggi'	: orang.height(),
												 'x'		: orang.offset().left,
												 'y'		: orang.offset().top };
								let posMotor = { 'lebar'	: $(this).width(),
												 'tinggi'	: $(this).height(),
												 'x'		: $(this).offset().left,
												 'y'		: $(this).offset().top };
								let lebarOrang = posOrang.x + posOrang.lebar - aturOrang.lebar;
								let lebarMotor = posMotor.x + posMotor.lebar;
								let tinggiOrang = posOrang.y + posOrang.tinggi - aturOrang.tinggi;
								let tinggiMotor = posMotor.y + posMotor.tinggi;
								if (lebarOrang >= posMotor.x && posOrang.x <= lebarMotor && tinggiOrang >= posMotor.y) {
									if ($(this).hasClass('tantangan')) {
										mati();
									}
									$(this).removeClass('belumLewat');
									$(this).removeClass('tantangan');
								} else if (posOrang.x > lebarMotor) {
									if ($(this).hasClass('tantangan')) {
										$(this).removeClass('tantangan');
										$(this).removeClass('belumLewat');

										strNilai = strNilai + 1;
										nilai.text(strNilai);
										hapusMotor();
									}
								}
						});
						collisionMotor();
					}, 1);
}

function bikinMotor() {
	frameMotor.prepend('<div class="motor">');
	motor = $('.motor');
	let jeniMotor = range(1, 3);
	let pilihMotor = 'motor' + jeniMotor;
	motor.first().addClass(pilihMotor + ' tantangan belumLewat');
	motor.first().css({'animation' : 'maju 18s forwards,  '+ pilihMotor +' .3s steps(3) infinite'});
}

function intervalMotor() {
	timerBikinMotor = setTimeout(function() {
				 	bikinMotor();
				  	window.clearTimeout(timerBikinMotor);
				 	durasi = range(3000, 5000);
				  	intervalMotor();
			 }, durasi);
}

function kontrol() {
	$(document).on('keydown', function(e) {
		if (e.keyCode == 32) {
			if (game.hasClass('start')) {
				jalan();
				hilangkanInfo().then(function() {
					tampilkanPapanNilai();
					tampilkanNyawa();
				});
				game.removeClass('start');
			} else if (game.hasClass('lanjutMain')) {
				lanjutMain();
			} else if (game.hasClass('reset')) {
				reset();
				jalan();
			} else if (orang.hasClass('pause')) {
				hilangkanInfo();
				jalan();
			} else {
				lompat();
			}
		} else if (e.keyCode == 80) {
			pause();
		}
	});
}

function init() {
	game = $('#game');
	orang = $('#orang');
	info = $('#info');
	infoNyawa = $('#infoNyawa');
	papanNilai = $('#papanNilai');
	frameMotor = $('#frameMotor');
	info.append('<h3 class="namaGame"><h4 class="instruksi">');
	papanNilai.append('<h5 class="nilai">');
	let strHati = '';
	for (let i = 1; i <= totalNyawa; i++) {
		strHati += '<div class="nyawa"></div>'; 
	}
	infoNyawa.append(strHati);
	nilai = $('.nilai');
	namaGame = $('.namaGame');
	instruksi = $('.instruksi');
	nyawa = $('.nyawa');
	nilai.text(strNilai);
	namaGame.text(strNamaGame);
	instruksi.text(strInstruksi);
	tampilkanInfo();
	pause();
	kontrol();
}

$(document).ready(function() {
	setTimeout(init(), 1000);
});