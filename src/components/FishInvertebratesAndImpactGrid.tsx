'use client';

import {
  AutoColumnSize,
  Autofill,
  ContextMenu,
  CopyPaste,
  DropdownMenu,
  Filters,
  HiddenRows,
  registerPlugin,
} from 'handsontable/plugins';

import {
  CheckboxCellType,
  NumericCellType,
  registerCellType,
} from 'handsontable/cellTypes';
import { HotTable, HotColumn, HotTableClass } from '@handsontable/react';

import 'handsontable/dist/handsontable.full.css';
import { Data } from './data';
import { useEffect, useRef } from 'react';
import Handsontable from 'handsontable';

registerCellType(CheckboxCellType);
registerCellType(NumericCellType);

registerPlugin(AutoColumnSize);
registerPlugin(Autofill);
registerPlugin(ContextMenu);
registerPlugin(CopyPaste);
registerPlugin(DropdownMenu);
registerPlugin(Filters);
registerPlugin(HiddenRows);

type GridProps = {
  data: Data;
};

enum Depths {
  DEPTH_0_20M = "0-20m",
  DEPTH_25_45M = "25-45m",
  DEPTH_50_70M = "50-70m",
  DEPTH_75_95M = "75-95m"
}

const depths = Object.values(Depths)

enum MAJOR_CATEGORIES {
  FISH = "Fish",
  INVERTEBRATES = "Invertebrates",
  IMPACTS = "Impacts"
}

const majorCategories = Object.values(MAJOR_CATEGORIES)

const labels = [
  /* ####### FISH ####### */
  {
    label: MAJOR_CATEGORIES.FISH,
    depth_0_20m: Depths.DEPTH_0_20M,
    depth_25_45m: Depths.DEPTH_25_45M,
    depth_50_70m: Depths.DEPTH_50_70M,
    depth_75_95m: Depths.DEPTH_75_95M
  },
  {
    label: "Butterflyfish",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Haemulidae",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Snapper",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Barramundi cod",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Humphead wrasse",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Bumphead parrot",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Parrotfish",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Moray eel",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  /* ####### FISH ####### */

  {
    label: "",
  },

  /* ####### FISH: Grouper ####### */

  {
    label: "Grouper",
    depth_0_20m: Depths.DEPTH_0_20M,
    depth_25_45m: Depths.DEPTH_25_45M,
    depth_50_70m: Depths.DEPTH_50_70M,
    depth_75_95m: Depths.DEPTH_75_95M
  },
  {
    label: "30-40 cm",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "40-50 cm",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "50-60 cm",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: ">60 cm",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },

  /* ####### FISH: Grouper ####### */

  {
    label: "",
  },
  {
    label: "",
  },

  /* ####### INVERTEBRATES ####### */

  {
    label: MAJOR_CATEGORIES.INVERTEBRATES,
    depth_0_20m: Depths.DEPTH_0_20M,
    depth_25_45m: Depths.DEPTH_25_45M,
    depth_50_70m: Depths.DEPTH_50_70M,
    depth_75_95m: Depths.DEPTH_75_95M
  },
  {
    label: "Banded coral shrimp",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Diadema",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Pencil urchin",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Collector urchin",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Sea cucumber",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Crown-of-thorns",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Triton",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Lobster",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  /* ####### INVERTEBRATES ####### */

  {
    label: "",
  },

  /* ####### INVERTEBRATES: Giant Clam ####### */
  {
    label: "Giant clam",
    depth_0_20m: Depths.DEPTH_0_20M,
    depth_25_45m: Depths.DEPTH_25_45M,
    depth_50_70m: Depths.DEPTH_50_70M,
    depth_75_95m: Depths.DEPTH_75_95M
  },
  {
    label: "Giant clam <10 cm",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Giant clam 10-20 cm",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Giant clam 20-30 cm",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Giant clam 30-40 cm",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Giant clam 40-50 cm",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Giant clam >50 cm",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  /* ####### INVERTEBRATES: Giant Clam ####### */


  /* ####### IMPACTS ####### */

  {
    label: "",
  },
  {
    label: "",
  },

  /* ####### IMPACTS ####### */
  {
    label: MAJOR_CATEGORIES.IMPACTS,
    depth_0_20m: Depths.DEPTH_0_20M,
    depth_25_45m: Depths.DEPTH_25_45M,
    depth_50_70m: Depths.DEPTH_50_70M,
    depth_75_95m: Depths.DEPTH_75_95M
  },
  {
    label: "Coral damage: boat/anchor",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Coral damage: dynamite",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Coral damage: other",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Trash: fish nets",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Trash: general",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Bleaching (% of coral population)",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Bleaching (% of colony)",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  /* ####### IMPACTS ####### */

  {
    label: "",
  },

  /* ####### IMPACTS: Coral Disease ####### */

  {
    label: "Coral Disease (% colonies affected)",
    depth_0_20m: Depths.DEPTH_0_20M,
    depth_25_45m: Depths.DEPTH_25_45M,
    depth_50_70m: Depths.DEPTH_50_70M,
    depth_75_95m: Depths.DEPTH_75_95M
  },
  {
    label: "Black Band",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "White Band",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },

  /* ####### IMPACTS: Coral Disease ####### */

  {
    label: "",
  },

  /* ####### IMPACTS: Rare animals sighted ####### */
  {
    label: "Rare animals sighted (#/type/size)",
    depth_0_20m: Depths.DEPTH_0_20M,
    depth_25_45m: Depths.DEPTH_25_45M,
    depth_50_70m: Depths.DEPTH_50_70M,
    depth_75_95m: Depths.DEPTH_75_95M
  },
  {
    label: "Sharks",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Turtles",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Mantas",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  {
    label: "Other",
    depth_0_20m: null,
    depth_25_45m: null,
    depth_50_70m: null,
    depth_75_95m: null,
  },
  /* ####### IMPACTS: Rare animals sighted ####### */
]


// export default function Grid(props: GridProps) {
export default function Grid() {
  const hotTableComponentRef = useRef<HotTableClass>(null)

  useEffect(() => {
    if (!hotTableComponentRef.current) return;
    const hotInstance = hotTableComponentRef.current.hotInstance;
    hotInstance?.updateSettings({
      cells(row, col) {
        const cellProperties: any = {}
        // const cellProperties: Partial<CellProperties> = {}

        // set readOnly for depth labels
        const cellData = hotInstance.getData()[row][col];
        if (depths.includes(cellData)) {
          cellProperties.readOnly = true;
          // cellProperties.renderer = mediumWeightRenderer
        }

        // styling?
        // TODO:
        // - apply a bold/stronger contrasting style for the category labels?
        // - apply a different style for the depth labels?
        if (majorCategories.includes(cellData)) {
          cellProperties.renderer = majorCategoryRenderer
        }

        return cellProperties;
      }
    })
  }, [hotTableComponentRef])

  return (
    <HotTable
      ref={hotTableComponentRef}
      data={labels}
      colWidths={[200, 100, 100, 100, 100]}
      columns={[
        {
          data: "label",
          readOnly: true
        },
        {
          data: "depth_0_20m",
          type: "numeric"
        },
        {
          data: "depth_25_45m",
          type: "numeric"
        },
        {
          data: "depth_50_70m",
          type: "numeric"
        },
        {
          data: "depth_75_95m",
          type: "numeric"
        }
      ]}
      dropdownMenu={true}
      contextMenu={true}
      filters={true}
      rowHeaders={true}
      navigableHeaders={true}
      autoWrapRow={true}
      autoWrapCol={true}
      licenseKey="non-commercial-and-evaluation"
      height={720}
    >

    </HotTable>
  );
}

// @ts-ignore
function mediumWeightRenderer(instance, td, row, col, prop, value, cellProperties) {
  // @ts-ignore
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  td.style.fontWeight = "semi-bold";
}

// @ts-ignore
function majorCategoryRenderer(instance, td, row, col, prop, value, cellProperties) {
  // @ts-ignore
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  td.style.fontWeight = "bold";
}
