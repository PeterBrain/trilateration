//wird die Seite aufgerufen, wird die Funktion init() ausgeführt
window.onload = init();

document.getElementById('xa').oninput = init;
document.getElementById('xb').oninput = init;
document.getElementById('xc').oninput = init;

document.getElementById('ya').oninput = init;
document.getElementById('yb').oninput = init;
document.getElementById('yc').oninput = init;

document.getElementById('ra').oninput = init;
document.getElementById('rb').oninput = init;
document.getElementById('rc').oninput = init;

function init() {
	canvas = document.getElementById("canvas1");
	ctx = canvas.getContext("2d");
	
	//Beacon Koordinaten; müssen noch durch einmaliges Setup bestimmt werden
	/*A = [600, 500, 350];
	B = [0, 350, 300];
	C = [50, 0, 450];*/
	
	//Koordinaten sind relativ zur Canvas-Flächengröße
	/*A = [1.000, 0.830, 0.583];
	B = [0.000, 0.583, 0.500];
	C = [0.083, 0.000, 0.750];*/
	
	var xa = document.getElementById("xa").value;
	var xb = document.getElementById("xb").value;
	var xc = document.getElementById("xc").value;
	
	var ya = document.getElementById("ya").value;
	var yb = document.getElementById("yb").value;
	var yc = document.getElementById("yc").value;
	
	var ra = document.getElementById("ra").value;
	var rb = document.getElementById("rb").value;
	var rc = document.getElementById("rc").value;
	
	A = [xa, ya, ra];
	B = [xb, yb, rb];
	C = [xc, yc, rc];
	
	//hole die Länge und Breite des Canvas Feldes
	var height = canvas.height / 4 * 3;
	var width = canvas.width / 4 * 3;
	var diff = width * 1 / 3;
	
	//In Objekte umformen
	A = {
		x: A[0] * width + diff / 2,
		y: A[1] * height + diff / 2,
		r: A[2] * width
	};
	B = {
		x: B[0] * width + diff / 2,
		y: B[1] * height + diff / 2,
		r: B[2] * width
	};
	C = {
		x: C[0] * width + diff / 2,
		y: C[1] * height + diff / 2,
		r: C[2] * width
	};
	
	//Trilateration berechnen in einer Funktion
	var P0 = IntersectionCircle([A.x, A.y], A.r, [B.x, B.y], B.r, [C.x, C.y], C.r, width, diff);
	//document.getElementById("out").innerHTML = P0;
	
	for (var i = 0; i < 9; i++) {
		document.getElementById('tablex' + i).innerHTML = P0[i][0].toFixed(4);
	}
	
	for (i = 0; i < 9; i++) {
		document.getElementById('tabley' + i).innerHTML = P0[i][1].toFixed(4);
	}
	
	//Rückgabewerte entpacken
	P = [{
		x: P0[0][0],
		y: P0[0][1]
	}, {
		x: P0[1][0],
		y: P0[1][1]
	}, {
		x: P0[2][0],
		y: P0[2][1]
	}, {
		x: P0[3][0],
		y: P0[3][1]
	}, {
		x: P0[4][0],
		y: P0[4][1]
	}, {
		x: P0[5][0],
		y: P0[5][1]
	}, {
		x: P0[6][0],
		y: P0[6][1]
	}, {
		x: P0[7][0],
		y: P0[7][1]
	}, {
		x: P0[8][0],
		y: P0[8][1]
	}];
	
	var P1 = IntersectionLines([P[0].x, P[0].y], [P[1].x, P[1].y], [P[2].x, P[2].y], [P[3].x, P[3].y], [P[4].x, P[4].y], [P[5].x, P[5].y]);
	
	K = [{
		x: P1[0][0],
		y: P1[0][1]
	}, {
		x: P1[1][0],
		y: P1[1][1]
	}, {
		x: P1[2][0],
		y: P1[2][1]
	}];
	
	for (i = 0; i < 3; i++) {
		document.getElementById('tablePx' + i).innerHTML = K[i].x.toFixed(4);
	}
	
	for (i = 0; i < 3; i++) {
		document.getElementById('tablePy' + i).innerHTML = K[i].y.toFixed(4);
	}
	
	Canvas(A, B, C, P, K, width, diff);
}

function Canvas(A, B, C, P, K, width, diff) {
	//Canvas Area Style
	if (P !== null) {
		ctx.fillStyle = "#EEE";
	} else {
		ctx.fillStyle = "#800";
	}
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	ctx.rect(diff / 2, diff / 2, width, width);
	ctx.stroke();
	
	//Kreis A ROT
	ctx.fillStyle = "#f00";
	ctx.strokeStyle = ctx.fillStyle;
	ctx.fillRect(A.x - 2, A.y - 2, 4, 4);
	ctx.beginPath();
	ctx.arc(A.x, A.y, A.r, 0, 2 * Math.PI);
	ctx.fillStyle = "rgba(255,0,0,.2)";
	ctx.fill();
	ctx.stroke();
	
	//Kreis B GRUEN
	ctx.fillStyle = "#0f0";
	ctx.strokeStyle = ctx.fillStyle;
	ctx.fillRect(B.x - 2, B.y - 2, 4, 4);
	ctx.beginPath();
	ctx.arc(B.x, B.y, B.r, 0, 2 * Math.PI);
	ctx.fillStyle = "rgba(0,255,0,.2)";
	ctx.fill();
	ctx.stroke();
	
	//Kreis C BLAU
	ctx.fillStyle = "#00f";
	ctx.strokeStyle = ctx.fillStyle;
	ctx.fillRect(C.x - 2, C.y - 2, 4, 4);
	ctx.beginPath();
	ctx.arc(C.x, C.y, C.r, 0, 2 * Math.PI);
	ctx.fillStyle = "rgba(0,0,255,.2)";
	ctx.fill();
	ctx.stroke();
	
	if (P !== null) {
		if (P instanceof Array) {
			//Schnittpunkte der Kreise
			ctx.fillStyle = "#0ff";
			ctx.fillRect(P[0].x - 2, P[0].y - 2, 4, 4);
			ctx.fillRect(P[2].x - 2, P[2].y - 2, 4, 4);
			ctx.fillRect(P[4].x - 2, P[4].y - 2, 4, 4);
			
			ctx.fillStyle = "#ff0";
			ctx.fillRect(P[1].x - 2, P[1].y - 2, 4, 4);
			ctx.fillRect(P[3].x - 2, P[3].y - 2, 4, 4);
			ctx.fillRect(P[5].x - 2, P[5].y - 2, 4, 4);
			
			//Geraden durch den Mittelpunkt von Position
			ctx.strokeStyle = "#000";
			/*ctx.beginPath();
			ctx.moveTo(P[0].x, P[0].y);
			ctx.lineTo(P[1].x, P[1].y);
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo(P[2].x, P[2].y);
			ctx.lineTo(P[3].x, P[3].y);
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo(P[4].x, P[4].y);
			ctx.lineTo(P[5].x, P[5].y);
			ctx.stroke();*/
			
			//Geraden von 0 bis xmax durch Position
			ctx.beginPath();
			ctx.moveTo(0, P[6].y);
			ctx.lineTo(width + diff, P[6].x);
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo(0, P[7].y);
			ctx.lineTo(width + diff, P[7].x);
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo(0, P[8].y);
			ctx.lineTo(width + diff, P[8].x);
			ctx.stroke();
			
			//Position
			ctx.fillStyle = "rgba(0,0,0,1)";
			
			ctx.beginPath();
			ctx.arc(K[0].x, K[0].y, 6, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
			
			/*ctx.beginPath();
			ctx.arc(K[1].x, K[1].y, 6, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
			
			ctx.beginPath();
			ctx.arc(K[2].x, K[2].y, 6, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();*/
			
			/*ctx.fillStyle = "#f00";
			ctx.fillRect(K[0].x - 3, K[0].y - 3, 6, 6);
			ctx.fillRect(K[1].x - 3, K[1].y - 3, 6, 6);
			ctx.fillRect(K[2].x - 3, K[2].y - 3, 6, 6);*/
		} else {
			ctx.fillStyle = "#fff";
			ctx.fillRect(K[0].x - 3, K[0].y - 3, 6, 6);
		}
	}
}

function IntersectionCircle(A, a, B, b, C, c, width, diff) {
	//Vektor zwischen Beacon A und B
	var ABx = B[0] - A[0];
	var ABy = B[1] - A[1];
	
	//Vektor zwischen Beacon B und C
	var BCx = C[0] - B[0];
	var BCy = C[1] - B[1];
	
	//Vektor zwischen Beacon C und A
	var CAx = A[0] - C[0];
	var CAy = A[1] - C[1];
	
	//Beträge 
	var AB = Math.sqrt(ABx * ABx + ABy * ABy);
	var BC = Math.sqrt(BCx * BCx + BCy * BCy);
	var CA = Math.sqrt(CAx * CAx + CAy * CAy);
	
	//gleicher Mittelpunkt
	if (AB == 0) {
		return ["Kreis A und B haben den gleichen Mittelpunkt"];
	} else if (BC == 0) {
		return ["Kreis B und C haben den gleichen Mittelpunkt"];
	} else if (CA == 0) {
		return ["Kreis C und A haben den gleichen Mittelpunkt"];
	}
	
	//X-Abstand der beiden Schnittpunkte vom Ursprung
	var xa = (a * a + AB * AB - b * b) / (2 * AB);
	var xb = (b * b + BC * BC - c * c) / (2 * BC);
	var xc = (c * c + CA * CA - a * a) / (2 * CA);
	
	//Y-Abstand der beiden Schnittpunkte vom Ursprung
	var ya = a * a - xa * xa;
	var yb = b * b - xb * xb;
	var yc = c * c - xc * xc;
	
	//keine Schnittpunkte
	if (ya < 0) {
		return ["Kreis A hat keine Schnittpunkte"];
	} else if (yb < 0) {
		return ["Kreis B hat keine Schnittpunkte"];
	} else if (yc < 0) {
		return ["Kreis C hat keine Schnittpunkte"];
	}
	
	//für Einheitsvektoren
	if (ya > 0 || yb > 0 || yc > 0) {
		ya = Math.sqrt(ya);
		yb = Math.sqrt(yb);
		yc = Math.sqrt(yc);
	}
	
	//Einheitsvektor
	var exa = ABx / AB;
	var exb = BCx / BC;
	var exc = CAx / CA;
	
	var eya = ABy / AB;
	var eyb = BCy / BC;
	var eyc = CAy / CA;
	
	//Normalvektor
	var nxa = -eya;
	var nxb = -eyb;
	var nxc = -eyc;
	
	var nya = exa;
	var nyb = exb;
	var nyc = exc;
	
	//X- und Y-Koordinate mit Polynomdarstellung berechnen
	var Q1xa = A[0] + xa * exa;
	var Q1xb = B[0] + xb * exb;
	var Q1xc = C[0] + xc * exc;
	
	var Q1ya = A[1] + xa * eya;
	var Q1yb = B[1] + xb * eyb;
	var Q1yc = C[1] + xc * eyc;
	
	//nur ein Schnittpunkt bei Kreis
	if (ya == 0 || yb == 0 || yc == 0) {
	
		return [
			//Schnittpunkt(e) Kreis A und B
			[Q1xa, Q1ya],
			[Q1xa, Q1ya],
			//Schnittpunkt(e) Kreis B und C
			[Q1xb, Q1yb],
			[Q1xb, Q1yb],
			//Schnittpunkt(e) Kreis C und A
			[Q1xc, Q1yc],
			[Q1xc, Q1yc]
		];
	
	} else {
	
		var Q2xa = Q1xa - ya * nxa;
		var Q2xb = Q1xb - yb * nxb;
		var Q2xc = Q1xc - yc * nxc;
		
		var Q2ya = Q1ya - ya * nya;
		var Q2yb = Q1yb - yb * nyb;
		var Q2yc = Q1yc - yc * nyc;
		
		Q1xa += ya * nxa;
		Q1xb += yb * nxb;
		Q1xc += yc * nxc;
		
		Q1ya += ya * nya;
		Q1yb += yb * nyb;
		Q1yc += yc * nyc;
		
		//Geradengleichungen für Schnittpunkte
		var ka = (Q2ya - Q1ya) / (Q2xa - Q1xa);
		var da = Q2ya - (ka * Q2xa);
		var yamax = ka * (width + diff) + da;
		var yamin = ka * 0 + da;
		
		var kb = (Q2yb - Q1yb) / (Q2xb - Q1xb);
		var db = Q2yb - (kb * Q2xb);
		var ybmax = kb * (width + diff) + db;
		var ybmin = kb * 0 + db;
		
		var kc = (Q2yc - Q1yc) / (Q2xc - Q1xc);
		var dc = Q2yc - (kc * Q2xc);
		var ycmax = kc * (width + diff) + dc;
		var ycmin = kc * 0 + dc;
		
		return [
			//Schnittpunkt(e) Kreis A und B
			[Q1xa, Q1ya],
			[Q2xa, Q2ya],
			//Schnittpunkt(e) Kreis B und C
			[Q1xb, Q1yb],
			[Q2xb, Q2yb],
			//Schnittpunkt(e) Kreis C und A
			[Q1xc, Q1yc],
			[Q2xc, Q2yc],
			//Geradenendpunkte durch die Schnittpunkte
			[yamax, yamin],
			[ybmax, ybmin],
			[ycmax, ycmin]
		];
	
	}
}

//document.getElementById("out").innerHTML = yy;

function IntersectionLines(S1, S2, S3, S4, S5, S6) {
	//Eingabe in x und y Variablen aufspalten
	var S1xa = S1[0];
	var S1ya = S1[1];
	var S2xa = S2[0];
	var S2ya = S2[1];
	
	var S1xb = S3[0];
	var S1yb = S3[1];
	var S2xb = S4[0];
	var S2yb = S4[1];
	
	var S1xc = S5[0];
	var S1yc = S5[1];
	var S2xc = S6[0];
	var S2yc = S6[1];
	
	
	//Richtungsvektor zwischen Q1 und Q2 A
	var S2S1xa = S1xa - S2xa;
	var S2S1ya = S1ya - S2ya;
	//Vektor zwischen A und B
	var S2S1xab = S1xa - S1xb;
	var S2S1yab = S1ya - S1yb;
	
	
	//Richtungsvektor zwischen Q1 und Q2 B
	var S2S1xb = S1xb - S2xb;
	var S2S1yb = S1yb - S2yb;
	//Vektor zwischen B und C
	var S2S1xbc = S1xb - S1xc;
	var S2S1ybc = S1yb - S1yc;
	
	
	//Richtungsvektor zwischen Q1 und Q2 C
	var S2S1xc = S1xc - S2xc;
	var S2S1yc = S1yc - S2yc;
	//Vektor zwischen C und A
	var S2S1xca = S1xc - S1xa;
	var S2S1yca = S1yc - S1ya;
	
	
	//Einheitsvektor von Q2Q1 A
	var S2S1a = Math.sqrt(S2S1xa * S2S1xa + S2S1ya * S2S1ya);
	var exa = S2S1xa / S2S1a;
	var eya = S2S1ya / S2S1a;
	
	//Normalvektor
	var nxa = -eya;
	var nya = exa;
	
	
	//Einheitsvektor von Q2Q1 B
	var S2S1b = Math.sqrt(S2S1xb * S2S1xb + S2S1yb * S2S1yb);
	var exb = S2S1xb / S2S1b;
	var eyb = S2S1yb / S2S1b;
	
	//Normalvektor B
	var nxb = -eyb;
	var nyb = exb;
	
	
	//Einheitsvektor von Q2Q1 C
	var S2S1c = Math.sqrt(S2S1xc * S2S1xc + S2S1yc * S2S1yc);
	var exc = S2S1xc / S2S1c;
	var eyc = S2S1yc / S2S1c;
	
	//Normalvektor C
	var nxc = -eyc;
	var nyc = exc;
	
	
	//zerlegen des Vektors zwischen A und B
	var qx = S2S1xab * exa + S2S1yab * eya;
	var qy = S2S1xab * nxa + S2S1yab * nya;
	//zerlegen des Einheitsvektors zwischen A und B
	var sx = exb * exa + eyb * eya;
	var sy = exb * nxa + eyb * nya;
	//lambda für das einsetzen in die Polynomdarstellung
	var a = qx - qy * (sx / sy);
	//X- und Y- Koordinate berechnen
	var xab = S1xa - a * exa;
	var yab = S1ya - a * eya;
	
	
	//zerlegen des Vektors zwischen B und C
	var qx = S2S1xbc * exb + S2S1ybc * eyb;
	var qy = S2S1xbc * nxb + S2S1ybc * nyb;
	//zerlegen des Einheitsvektors zwischen B und C
	var sx = exc * exb + eyc * eyb;
	var sy = exc * nxb + eyc * nyb;
	//lambda für das einsetzen ind die Polynomdastellung
	var b = qx - qy * sx / sy;
	//X- und Y-Koordinate berechnen
	var xbc = S1xb - b * exb;
	var ybc = S1yb - b * eyb;
	
	
	//zerlegen des Vektors zwischen C und A
	var qx = S2S1xca * exc + S2S1yca * eyc;
	var qy = S2S1xca * nxc + S2S1yca * nyc;
	//zerlegen des Einheitsvektors zwischen C und A
	var sx = exa * exc + eya * eyc;
	var sy = exa * nxc + eya * nyc;
	//lambda für das einsetzen in die Polynomdastellung
	var c = qx - qy * sx / sy;
	//X- und Y-Koordinate berechnen
	var xca = S1xc - c * exc;
	var yca = S1yc - c * eyc;
	
	//Werte in Arrays in einem Array zurückgeben
	return [
		[xab, yab],
		[xbc, ybc],
		[xca, yca]
	];
}