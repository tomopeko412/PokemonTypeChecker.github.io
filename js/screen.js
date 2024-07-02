//18タイプの定義
const TYPE = [
  "Normal"
  , "Fire"
  , "Water"
  , "Grass"
  , "Electric"
  , "Ice"
  , "Fighting"
  , "Poison"
  , "Ground"
  , "Flying"
  , "Psychic"
  , "Bug"
  , "Rock"
  , "Ghost"
  , "Dragon"
  , "Dark"
  , "Steel"
  , "Fairy"
]

////連想配列のキーと値確認　引数：任意の連想配列
//用途：テスト
function Check_key_value(Associative_array) {
  for (var key in Associative_array) {
    console.log(Associative_array + 'の' + key + 'の値：' + Associative_array[key]);
  }
}

let Flag_mgmt = {}; //フラグマネージャー
let Each_Flag = ['Offense_Flag', 'Defense_Flag']; //各種フラグ

//各フラグ作成
for (let i = 0; i < Each_Flag.length; i++) {
  Flag_mgmt[Each_Flag[i]] = ['', ''];
  // for (let j = 0; j < TYPE.length; j++) {
  //   Flag_mgmt[Each_Flag[i]][TYPE[j]] = 0;
  // }
}

let result_grid;//相性計算出力先の要素格納用
let select_grid;//
let gridElement = document.querySelectorAll('.grid')//class｢grid｣を含む要素を配列形式ですべて格納
for (let i = 0; i < gridElement.length; i++) {
  if (gridElement[i].parentElement.id == "result") {
    result_grid = gridElement[i].children;
  }
  if (gridElement[i].parentElement.id == "select-type") {
    select_grid = gridElement[i];
  }
}

//防御、攻撃の判定
let Side_Flag = 'Offense_Flag';//読み込み時は攻撃で固定

///////////////ここからタイプ相性計算処理///////////////
/*
攻めか受けを判定
フラグの立っているタイプで相性計算
計算結果を出力
*/


/*
タイプ相性計算の関数
引数1：文字列('Offense_Flag','Defense_Flag')のいづれか
計算結果を直接HTMLに出力
*/
function Type_compatibility_calculation($side) {
  let Flag_Type = Flag_mgmt[$side];//Flag_Typeにフラグを格納

  for (let i = 0; i < TYPE.length; i++) {
    if (result_grid[i].children[1].classList.contains('Compatibility-half')) {
      result_grid[i].children[1].classList.remove('Compatibility-half');
    }
    if (result_grid[i].children[1].classList.contains('Compatibility-2')) {
      result_grid[i].children[1].classList.remove('Compatibility-2');
    }
  }

  if ($side == 'Offense_Flag'
    && Flag_Type[0] != '') {//攻撃でフラグが建っているとき
    for (let i = 0; i < TYPE.length; i++) {
      let magnification = 1;
      magnification = Type_Calculation[Flag_Type[0]][TYPE[i]];
      if (magnification == 0) {
        result_grid[i].children[1].innerHTML = "効果なし";
      }
      else if (magnification != 1) {
        result_grid[i].children[1].innerHTML = "×" + magnification;
        if (magnification == 0.5) {
          result_grid[i].children[1].classList.add('Compatibility-half');
        } else if (magnification == 2) {
          result_grid[i].children[1].classList.add('Compatibility-2');
        }
      } else {
        result_grid[i].children[1].innerHTML = '';
      }
    }
  } else if ($side == 'Defense_Flag'
    && Flag_Type[0] != '') {//防御でフラグが建っているとき
    for (let i = 0; i < TYPE.length; i++) {
      let magnification = 1;
      let magnification_1 = 1;
      let magnification_2 = 1;
      magnification_1 = Type_Calculation[TYPE[i]][Flag_Type[0]];
      if ([Flag_Type[1]] != '') {//2つ目のタイプのフラグが建っているとき
        magnification_2 = Type_Calculation[TYPE[i]][Flag_Type[1]];
      }
      magnification = magnification_1 * magnification_2
      if (magnification == 0) {
        result_grid[i].children[1].innerHTML = "効果なし";
      }
      else if (magnification != 1) {
        result_grid[i].children[1].innerHTML = "×" + magnification;
        if (magnification == 0.5 || magnification == 0.25) {
          result_grid[i].children[1].classList.add('Compatibility-half');
        } else if (magnification == 2 || magnification == 4) {
          result_grid[i].children[1].classList.add('Compatibility-2');
        }
      } else {
        result_grid[i].children[1].innerHTML = '';
      }
    }
  } else if (Flag_Type[0] == '') {//フラグが建っていない時
    for (let i = 0; i < TYPE.length; i++) {
      result_grid[i].children[1].innerHTML = '';
    }
  }
}

///////////////ここまでタイプ相性計算処理///////////////


///////////////ここからタイプ選択処理///////////////

//select_typeのクリックされた要素のdata属性を取得しタイプを特定
//Max_select_typesを超えるときフラグ1を0に、2を1に置き換える
//タイプにフラグを建ててcss(border)を付与
//class'grid_type'のタイプを取得し、data-typeを付与
let $grid_type = document.querySelectorAll('.grid_type');
for (let i = 0; i < $grid_type.length; i++) {
  for (let j = 0; j < TYPE.length; j++) {
    // TYPE[i];
    if (TYPE[j] == $grid_type[i].classList[1]) {
      $grid_type[i].dataset.type = TYPE[j];
      break;
    }
    else if ('riset' == $grid_type[i].classList[1]) {
      $grid_type[i].dataset.type = 'riset';
      break;
    }
    else {
      $grid_type[i].dataset.type = '';
    }
  }
}

window.addEventListener('load', function () {
  //タイプクリック時に枠線を付ける処理
  select_grid.addEventListener('click', function (e) {
    /*
    攻め受けの認識をする
    タイプに枠線を付ける
    上限超えたら古い枠線を消す
    枠線のついているタイプにフラグを建てる
    リセットを押されたら枠線を消す
    */
    let clicked_type = e.target.dataset.type;//クリックされた要素のdata属性からタイプを特定

    for (let i = 0; i < $grid_type.length; i++) {//$grid_type+''+resetの数だけ回す
      if (clicked_type == $grid_type[i].classList[1]) {//クリックされたタイプと同じか判定
        if (Side_Flag == 'Offense_Flag'
          && clicked_type != 'riset') {//攻撃の時
          if (Flag_mgmt[Side_Flag][0] == clicked_type) {//クリックされたタイプのフラグが建っているとき
            //フラグを折り、枠線を外す
            Flag_mgmt[Side_Flag][0] = '';
            $grid_type[i].classList.remove('border');
          }
          else if (Flag_mgmt[Side_Flag][0] != clicked_type) {//クリックされたタイプのフラグが無いとき
            if (Flag_mgmt[Side_Flag][0] != '') {//別タイプのフラグが建っているとき
              //別タイプの枠線を外す
              select_grid.children[TYPE.indexOf(Flag_mgmt[Side_Flag][0])].classList.remove('border');
            }
            //クリックされたタイプにフラグを建てて、枠線を付ける
            Flag_mgmt[Side_Flag][0] = clicked_type;
            $grid_type[i].classList.add('border');
          }
          break;
          //攻撃ここまで
        } else if (Side_Flag == 'Defense_Flag'
          && clicked_type != 'riset') {//防御の時
          if (Flag_mgmt[Side_Flag][0] == ''
            && Flag_mgmt[Side_Flag][1] == '') {//******0番フラグなし,1番フラグなし******//
            //0番にクリックしたタイプのフラグ建てる
            Flag_mgmt[Side_Flag][0] = clicked_type;
            //クリックしたタイプに枠線を付ける
            $grid_type[i].classList.add('border');
          } else if (Flag_mgmt[Side_Flag][0] == ''
            && Flag_mgmt[Side_Flag][1] != '') {//******0番フラグなし,1番フラグあり******//
            //1番のフラグを0番に移動する
            Flag_mgmt[Side_Flag][0] = Flag_mgmt[Side_Flag][1];
            Flag_mgmt[Side_Flag][1] = '';
            if (Flag_mgmt[Side_Flag][0] == clicked_type) {//0番フラグとクリックしたタイプが同じとき
              //0番のフラグを折り、枠線を外す
              Flag_mgmt[Side_Flag][0] = '';
              $grid_type[i].classList.remove('border');
            } else if (Flag_mgmt[Side_Flag][0] != clicked_type) {//0番フラグとクリックしたタイプが違うとき
              //1番にクリックしたタイプのフラグ建て、枠線を建てる
              Flag_mgmt[Side_Flag][1] = clicked_type;
              $grid_type[i].classList.add('border');
            }
          } else if (Flag_mgmt[Side_Flag][0] != ''
            && Flag_mgmt[Side_Flag][1] == '') {//******0番フラグあり,1番フラグなし******//
            if (Flag_mgmt[Side_Flag][0] == clicked_type) {//0番フラグとクリックしたタイプが同じとき
              //0番のフラグを折り、枠線を外す
              Flag_mgmt[Side_Flag][0] = '';
              $grid_type[i].classList.remove('border');
            } else if (Flag_mgmt[Side_Flag][0] != clicked_type) {//0番フラグとクリックしたタイプが違うとき
              //1番にクリックしたタイプのフラグ建て、枠線を建てる
              Flag_mgmt[Side_Flag][1] = clicked_type;
              $grid_type[i].classList.add('border');
            }
          } else if (Flag_mgmt[Side_Flag][0] != ''
            && Flag_mgmt[Side_Flag][1] != '') {//******0番フラグあり,1番フラグあり******//
            if (Flag_mgmt[Side_Flag][0] == clicked_type) {//クリックしたタイプのフラグが0番に建っているとき
              //1番のフラグを0番に移動し、枠線を外す
              Flag_mgmt[Side_Flag][0] = Flag_mgmt[Side_Flag][1];
              Flag_mgmt[Side_Flag][1] = '';
              $grid_type[i].classList.remove('border');
            } else if (Flag_mgmt[Side_Flag][1] == clicked_type) {//クリックしたタイプのフラグが1番に建っているとき
              //1番のフラグを折り、枠線を外す
              Flag_mgmt[Side_Flag][1] = '';
              $grid_type[i].classList.remove('border');
            } else {//クリックしたタイプのフラグが建っていない時
              //0番の枠線を外す
              select_grid.children[TYPE.indexOf(Flag_mgmt[Side_Flag][0])].classList.remove('border');
              //1番のフラグを0番に移動する
              Flag_mgmt[Side_Flag][0] = Flag_mgmt[Side_Flag][1];
              //1番にクリックしたタイプのフラグ建て、枠線を建てる
              Flag_mgmt[Side_Flag][1] = clicked_type;
              $grid_type[i].classList.add('border');
            }
          }
          break;
          //防御ここまで
        } else if (clicked_type == 'riset') {//リセットをクリックしたとき
          for (let j = 0; j < $grid_type.length; j++) {
            $grid_type[j].classList.remove("border");
          }
          Flag_mgmt[Side_Flag] = ['', ''];
          break;
          //リセットをクリックしたときここまで
        } else if (clicked_type == undefined) {
          break;
        }
      }
    }
    Type_compatibility_calculation(Side_Flag);
  });
  ///////////////ここまでタイプ選択処理///////////////

  ///////////////ここから攻守切り替え処理///////////////

  let $btn_O = document.querySelector('.Offense');
  let $btn_D = document.querySelector('.Defense');
  $btn_D.addEventListener('click', function () {
    if ($btn_O.classList.contains('border')) {
      $btn_O.classList.remove('border');
      $btn_D.classList.add('border');
      Side_Flag = 'Defense_Flag';
      switch_Side(Side_Flag);
      Type_compatibility_calculation(Side_Flag);
    }
    //console.log(Max_select_types);
  });
  $btn_O.addEventListener('click', function () {
    if ($btn_D.classList.contains('border')) {
      $btn_D.classList.remove('border');
      $btn_O.classList.add('border');
      Side_Flag = 'Offense_Flag'
      switch_Side(Side_Flag);
      Type_compatibility_calculation(Side_Flag);
    }
    //console.log(Max_select_types);
  });
});

function switch_Side($Side) {
  for (let i = 0; i < $grid_type.length; i++) {
    if (Flag_mgmt[$Side][0] == $grid_type[i].classList[1]
      || Flag_mgmt[$Side][1] == $grid_type[i].classList[1]) {
      $grid_type[i].classList.add('border')
    } else if (Flag_mgmt[$Side][0] != $grid_type[i].classList[1]
      && Flag_mgmt[$Side][1] != $grid_type[i].classList[1]) {
      $grid_type[i].classList.remove('border')
    }
  }
}
///////////////ここまで攻守切り替え処理///////////////
