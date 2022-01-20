<?php

include_once('functions.php');

function loadPaperBase() {
    $baseFile=fopen ("paperbase.csv", "r");
		while (!feof($baseFile)){
			$arItem=explode(";", fgets($baseFile));
			$arBaseItem['ARTICLE'] = $arItem[0];
            $arBaseItem['TYPE'] = $arItem[1];
            $arBaseItem['TITLE'] = $arItem[2];
            $arBaseItem['UNIT'] = $arItem[3];
            $arBaseItem['NORMA'] = $arItem[4];
            $arBaseItem['PRICE'] = str_replace(',','.',$arItem[5]) * currency()[trim($arItem[6])];
            $arBase[] = $arBaseItem;
		};
		fclose($baseFile);
    return $arBase;
};

$arPapers = loadPaperBase();
echo(json_encode($arPapers));
