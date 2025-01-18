import { TimeStudyConnectionSetup } from "./TimeStudyConnection";
import { TimeStudySetup } from "./TimeStudyButton";

class TimeStudyRow {
  constructor(layout, items, isWide) {
    this.layout = layout;
    this.items = items;
    this.isWide = isWide;
  }

  get width() {
    const itemCount = this.items.length;
    const layout = this.layout;
    return itemCount * layout.itemWidth + (itemCount - 1) * layout.spacing;
  }

  itemPosition(column, treeLayout) {
    const layout = this.layout;
    const treeWidth = treeLayout.width;
    const rowLeft = (treeWidth - this.width) / 2;
    return rowLeft + column * layout.itemWidth + column * layout.spacing;
  }
}

class TimeStudyRowLayout {
  constructor(props) {
    this.itemWidth = props.itemWidth;
    this.itemHeight = props.itemHeight;
    this.spacing = props.spacing;
  }
}

export default class TimeStudyTreeLayout {
  // eslint-disable-next-line complexity
  constructor(type, scaling = 1) {
    this.spacing = 4 * scaling;

    const normalRowLayout = new TimeStudyRowLayout({
      itemWidth: 18 * scaling,
      itemHeight: 10 * scaling,
      spacing: 3 * scaling
    });

    const wideRowLayout = new TimeStudyRowLayout({
      itemWidth: 12 * scaling,
      itemHeight: 10 * scaling,
      spacing: 0.6 * scaling
    });
    const normalRow = (...items) => new TimeStudyRow(normalRowLayout, items);
    const wideRow = (...items) => new TimeStudyRow(wideRowLayout, items, true);

    const TS = id => (TimeStudy(id).isUnlocked ? TimeStudy(id) : null);
    const EC = id => TimeStudy.eternityChallenge(id);

    /**
     * @type {TimeStudyRow[]}
     */
    /* eslint-disable no-multi-spaces, space-in-parens, func-call-spacing */
    this.rows = [
      normalRow(                       null,   TS(11),   null                         ),
      normalRow(                   null, TS(21), TS(22), TS(305)                      ),
      normalRow(                   null, TS(31), TS(32), TS(33)                       )
    ];

    if (type.alt62) {
      this.rows.push(
        normalRow(                     null, TS(41), TS(42), EC(5)                      ),
        normalRow(                               TS(51)                                 )
      );
    } else {
      this.rows.push(
        normalRow(                           TS(41), TS(42)                             ),
        normalRow(                       null,   TS(51),  EC(5)                         )
      );
    }

    this.rows.push(
      normalRow(                       null,   TS(61),  TS(62)                        ));
    if (type.mvdUnlocked) {
      this.rows.push(
        normalRow(                 TS(71),  TS(72),  TS(73), TS(74)               ),
        normalRow(                 TS(81),  TS(82),  TS(83), TS(84)               ),
        normalRow(                 TS(91),  TS(92),  TS(93), TS(94)               ),
        normalRow(                 TS(101), TS(102), TS(103), TS(104)             ));
    } else {
      this.rows.push(
        normalRow(                      TS(71),  TS(72),  TS(73)                        ),
        normalRow(                      TS(81),  TS(82),  TS(83)                        ),
        normalRow(                      TS(91),  TS(92),  TS(93)                        ),
        normalRow(                      TS(101), TS(102), TS(103)                       ));
    }
    if (type.triadDim) {
      this.rows.push(normalRow(TS(321), TS(322), TS(323), TS(324)));
    }
    this.rows.push(
      normalRow(                       EC(7),  TS(111),  TS(306)                      ),
      normalRow(                      TS(121), TS(122), TS(123)                       ),
      normalRow(               EC(6), TS(131), TS(132), TS(133), EC(8)                ),
      normalRow(                      TS(141), TS(142), TS(143)                       ));
    if (type.triadPace) {
      this.rows.push(normalRow(null, TS(311), TS(312), TS(313), EC(4)),
        normalRow(               EC(9), TS(151),   null,                   ));
    } else {
      this.rows.push(normalRow(               null,   EC(9), TS(151),   null,   EC(4) ));
    }
    this.rows.push(

      normalRow(                          TS(161), TS(162)                            )
    );

    if (type.alt181) {
      this.rows.push(
        normalRow(                         null, TS(171),  EC(2)                        ),
        normalRow(                        EC(1), TS(181),  EC(3)                        )
      );
    } else {
      this.rows.push(
        normalRow(                               TS(171)                                ),
        normalRow(                         EC(1), EC(2), EC(3)                          ),
        normalRow(                               TS(181)                                )
      );
    }

    this.rows.push(
      normalRow(                               EC(10)                                 ),
      normalRow(             TS(191),          TS(192),          TS(193)              ),
      normalRow(                         null, TS(201), TS(307)                       ),
      normalRow(    TS(211),          TS(212),          TS(213),          TS(214)     ),
      wideRow  (TS(221), TS(222), TS(223), TS(224), TS(225), TS(226), TS(227), TS(228))
    );

    if (type.triad && !Pelle.isDoomed) {
      this.rows.push(
        normalRow(                 TS(301), TS(302), TS(303), TS(304)                 )
      );
    }

    this.rows.push(
      normalRow(    TS(231),          TS(232),          TS(233),          TS(234)     ),
      normalRow(              EC(11),                             EC(12)              ),
      normalRow(                  null, TimeStudy.dilation, TS(308)                   )
    );

    if (type.mu9) {
      this.rows.push(
        normalRow(TimeStudy.TGformula, TimeStudy.timeDimension(5), TimeStudy.timeDimension(6)),
        normalRow(TimeStudy.TPformula, TimeStudy.timeDimension(7), TimeStudy.timeDimension(8))
      );
    } else {
      this.rows.push(
        normalRow(TimeStudy.timeDimension(5), TimeStudy.timeDimension(6)),
        normalRow(TimeStudy.timeDimension(7), TimeStudy.timeDimension(8))
      );
    }

    this.rows.push(
      normalRow(                          TimeStudy.reality                           )
    );
    /* eslint-enable no-multi-spaces, space-in-parens, func-call-spacing */

    /**
     * @type {TimeStudySetup[]}
     */
    this.studies = [];
    for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
      const row = this.rows[rowIndex];
      for (let columnIndex = 0; columnIndex < row.items.length; columnIndex++) {
        const study = row.items[columnIndex];
        if (study === null) continue;
        const setup = new TimeStudySetup({
          study,
          row: rowIndex,
          column: columnIndex
        });
        if (row.isWide) {
          setup.isSmall = true;
        }
        this.studies.push(setup);
      }
    }
    const secretStudy = {};
    this.secretStudy = new TimeStudySetup({
      study: secretStudy,
      row: 0,
      column: 0
    });

    const enslavedStudy = {};
    this.enslavedStudy = new TimeStudySetup({
      study: enslavedStudy,
      row: 0,
      column: 2
    });

    /**
     * @type {TimeStudyConnectionSetup[]}
     */
    this.connections = TimeStudy.allConnections
      .map(c => new TimeStudyConnectionSetup(c));
    this.secretStudyConnection = new TimeStudyConnectionSetup(
      new TimeStudyConnection(TS(11), secretStudy)
    );
    this.enslavedStudyConnection = new TimeStudyConnectionSetup(
      new TimeStudyConnection(TS(11), enslavedStudy)
    );

    this.width = this.rows.map(row => row.width).nMax();
    const heightNoSpacing = this.rows.map(r => r.layout.itemHeight).nSum();
    this.height = heightNoSpacing + (this.rows.length - 1) * this.spacing;

    for (const study of this.studies) {
      study.setPosition(this);
    }
    this.secretStudy.setPosition(this);
    this.enslavedStudy.setPosition(this);

    for (const connection of this.connections) {
      if (!connection.isOverridden) connection.setPosition(this.studies, this.width, this.height);
    }
    this.secretStudyConnection.setPosition(this.studies.concat(this.secretStudy), this.width, this.height);
    this.enslavedStudyConnection.setPosition(this.studies.concat(this.enslavedStudy), this.width, this.height);
  }

  itemPosition(row) {
    const rows = this.rows.slice(0, row);
    const heightNoSpacing = rows.map(r => r.layout.itemHeight).nSum();
    return heightNoSpacing + rows.length * this.spacing;
  }

  static get current() {
    return {
      alt62: Perk.bypassEC5Lock.isBought,
      alt181: Perk.bypassEC1Lock.isBought && Perk.bypassEC2Lock.isBought && Perk.bypassEC3Lock.isBought,
      mu9: MendingUpgrade(9).isBought,
      triad: Ra.canBuyTriad,
      triadPace: (Ra.unlocks.unlockHardV.effectOrDefault(0) >= 9),
      triadDim: (Ra.unlocks.unlockHardV.effectOrDefault(0) >= 12),
      mvdUnlocked: false //Ra.pets.laitela.level >= 75,
    };
  }

  static create(type, scaling = 1) {
    if (this._instances === undefined) {
      this._instances = {};
    }
    const layout = new TimeStudyTreeLayout(type, scaling);
    this._instances[`${Object.keys(type).filter(x => type[x]).join("")}__${scaling}`] = layout;
    return layout;
  }
}
