<?php
	// データは事前にソートされている前提
  $data = file_get_contents("./blackoutdata.json");
  $json = json_decode($data);
  $len = count($json);
  $group = array($len);
  $address = array($len);

  for($i=0; $i<$len; $i++){
    $group[$i] = $json[$i]->group;    
    $address[$i] = $json[$i]->address;
  }

  $query = $_REQUEST['query'];
  $query = json_decode($query);


  $l = count($query);
  if(is_array($query) && $l>0){
    for($i=0; $i<$l; $i++){
      $q = $query[$i];
      $key = array_search($q, $address);
      if($key){
				$addr = $address[$key];
				$g = array();
				$j = $key;
				while($j > -1){
					$tmp = $group[$j];
					if(array_search($tmp, $g) === false){
						array_push($g, $tmp);
					}
					
					array_splice($address, $j, 1);
					array_splice($group, $j, 1);

					$j = array_search($q, $address);
				}

        $ret = array("address"=>$addr, "group"=>$g);
        echo json_encode($ret);
        exit;
      }
    }
  }

  echo json_encode(array("address"=>"", "group"=>0));
?>
