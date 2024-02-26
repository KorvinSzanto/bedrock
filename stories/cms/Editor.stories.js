import Editor from '../../assets/cms/components/editor/Editor.vue'
import {LexicalTreeViewPlugin} from "lexical-vue";
import {ref} from "vue";

const testHtml = `
<h1><a data-concrete-page-id="10">Concrete Page Link</a></h1>
<img style="width:250px;float:right" src="https://upload.wikimedia.org/wikipedia/commons/2/26/Basket_of_Flowers_Egg_%28Faberg%C3%A9%29.jpg" />
<p class="ccm-editor-theme--paragraph" dir="ltr" style="text-align: start;">
    <span style="white-space: pre-wrap;">The&nbsp;</span>
    <b>
        <strong class="ccm-editor-theme--textBold" style="white-space: pre-wrap;">Basket of Flowers</strong>
    </b>
    <a href="https://en.wikipedia.org/wiki/Basket_of_Flowers_(Faberg%C3%A9_egg)#cite_note-2" class="ccm-editor-theme--link">
        <sup style="white-space: pre-wrap;">
            <span class="ccm-editor-theme--textSuperscript">[note 1]</span>
        </sup>
    </a>
    <span style="white-space: pre-wrap;">&nbsp;egg is a jewelled&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Vitreous_enamel" title="Vitreous enamel" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">enameled</span>
    </a>
    <span style="white-space: pre-wrap;">&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Easter_egg" title="Easter egg" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">Easter egg</span>
    </a>
    <span style="white-space: pre-wrap;">&nbsp;made under the supervision of the&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Russia" title="Russia" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">Russian</span>
    </a>
    <span style="white-space: pre-wrap;">&nbsp;jeweller&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Peter_Carl_Faberg%C3%A9" title="Peter Carl Fabergé" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">Peter Carl Fabergé</span>
    </a>
    <span style="white-space: pre-wrap;">&nbsp;in 1901. The&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Faberg%C3%A9_egg" title="Fabergé egg" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">Fabergé egg</span>
    </a>
    <span style="white-space: pre-wrap;">&nbsp;was made for&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Nicholas_II_of_Russia" title="Nicholas II of Russia" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">Nicholas II of Russia</span>
    </a>
    <span style="white-space: pre-wrap;">, who presented it to his wife, the Empress&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Alexandra_Feodorovna_(Alix_of_Hesse)" title="Alexandra Feodorovna (Alix of Hesse)" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">Alexandra Feodorovna</span>
    </a>
    <span style="white-space: pre-wrap;">.</span>
    <a href="https://en.wikipedia.org/wiki/Basket_of_Flowers_(Faberg%C3%A9_egg)#cite_note-royal-3" class="ccm-editor-theme--link">
        <sup style="white-space: pre-wrap;">
            <span class="ccm-editor-theme--textSuperscript">[2]</span>
        </sup>
    </a>
    <a href="https://en.wikipedia.org/wiki/Basket_of_Flowers_(Faberg%C3%A9_egg)#cite_note-Mieks-4" class="ccm-editor-theme--link">
        <sup style="white-space: pre-wrap;">
            <span class="ccm-editor-theme--textSuperscript">[3]</span>
        </sup>
    </a>
</p>

<p class="ccm-editor-theme--paragraph" dir="ltr" style="text-align: start;">
    <span style="white-space: pre-wrap;">If the egg originally came with a surprise (as the majority of Imperial Easter eggs) is unknown. There is no evidence on the objet d'art that it ever had another piece attached or with it and no document or photograph has been found proving the existence of an accompanying surprise.</span>
    <a href="https://en.wikipedia.org/wiki/Basket_of_Flowers_(Faberg%C3%A9_egg)#cite_note-academia-5" class="ccm-editor-theme--link">
        <sup style="white-space: pre-wrap;">
            <span class="ccm-editor-theme--textSuperscript">[4]</span>
        </sup>
    </a>
    <span style="white-space: pre-wrap;">&nbsp;The egg was executed by one of Fabergé's workmasters, but the name of the workmaster was not recorded and the egg itself bears no maker's marks or other hallmarks of its manufacture, at one point leading to some doubts as to its authenticity. It is designed as an egg-shaped&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Silver-gilt" title="Silver-gilt" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">silver-gilt</span>
    </a>
    <span style="white-space: pre-wrap;">&nbsp;oyster&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Guilloche" title="Guilloche" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">guilloche</span>
    </a>
    <span style="white-space: pre-wrap;">&nbsp;basket containing a bouquet of blossoms of&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Philadelphus_coronarius" title="Philadelphus coronarius" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">mock orange</span>
    </a>
    <span style="white-space: pre-wrap;">,&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Bellis_perennis" title="Bellis perennis" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">daisies</span>
    </a>
    <span style="white-space: pre-wrap;">,&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Pansy" title="Pansy" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">pansies</span>
    </a>
    <span style="white-space: pre-wrap;">,&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Calla" title="Calla" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">calla lilies</span>
    </a>
    <span style="white-space: pre-wrap;">,&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Centaurea_cyanus" title="Centaurea cyanus" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">cornflowers</span>
    </a>
    <span style="white-space: pre-wrap;">,&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Morning_glory" title="Morning glory" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">morning glories</span>
    </a>
    <span style="white-space: pre-wrap;">, and&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Oat" title="Oat" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">oats</span>
    </a>
    <span style="white-space: pre-wrap;">, with the date "1901" displayed on the front in diamonds. The egg stands on a blue enameled pedestal (not its original— the original white enamel was likely damaged during the&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Russian_Revolution" title="Russian Revolution" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">Russian Revolution</span>
    </a>
    <span style="white-space: pre-wrap;">&nbsp;and has been replaced/ re-enameled with the current blue seen today), and is surmounted by an arcing basket handle of gold and diamonds. Base and egg are also decorated in a trellis work of diamonds.</span>
    <a href="https://en.wikipedia.org/wiki/Basket_of_Flowers_(Faberg%C3%A9_egg)#cite_note-Mieks-4" class="ccm-editor-theme--link">
        <sup style="white-space: pre-wrap;">
            <span class="ccm-editor-theme--textSuperscript">[3]</span>
        </sup>
    </a>
    </p>
    <p></p>
    <h2 class="ccm-editor-theme--h2" dir="ltr" style="text-align: start;">
    <span style="white-space: pre-wrap;">History[</span>
    <a href="https://en.wikipedia.org/w/index.php?title=Basket_of_Flowers_(Faberg%C3%A9_egg)&amp;action=edit&amp;section=1" title="Edit section: History" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">edit</span>
    </a>
    <span style="white-space: pre-wrap;">]</span>
</h2>
<p class="ccm-editor-theme--paragraph" dir="ltr" style="text-align: start;">
    <span style="white-space: pre-wrap;">Though the existence of the egg has been clear since its manufacture, its authenticity as an "imperial" egg (i.e., an egg made in Fabergé's workshop and intended as an Easter gift for either the Czar's wife or his mother) was in doubt for some time. Beginning in 1949, some authorities began to identify the egg as being a non-imperial Fabergé creation; then, in 1979, other authorities began to claim that it was the work of another jeweller altogether, a&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Boucheron" title="Boucheron" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">Boucheron</span>
    </a>
    <span style="white-space: pre-wrap;">&nbsp;of Paris who had imitated Fabergé. In 1991 experts finally agreed that this egg was indeed the 1901 Easter gift of Nicholas II of Russia to his wife, and was made by the House of Fabergé for this purpose, officially making it an imperial Fabergé egg.</span>
</p>
<p class="ccm-editor-theme--paragraph" dir="ltr" style="text-align: start;">
    <span style="white-space: pre-wrap;">In 1933, the egg was sold by the&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Antikvariat" title="Antikvariat" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">Antikvariat</span>
    </a>
    <span style="white-space: pre-wrap;">&nbsp;(a&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Soviet_Union" title="Soviet Union" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">Soviet</span>
    </a>
    <span style="white-space: pre-wrap;">&nbsp;institution) probably to&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Emanuel_Snowman" title="Emanuel Snowman" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">Emanuel Snowman</span>
    </a>
    <span style="white-space: pre-wrap;">&nbsp;of London antique dealers&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Wartski" title="Wartski" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">Wartski</span>
    </a>
    <span style="white-space: pre-wrap;">, and it was acquired by&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Mary_of_Teck" title="Mary of Teck" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">Mary of Teck</span>
    </a>
    <span style="white-space: pre-wrap;">, and inherited by&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Queen_Elizabeth_II" title="Queen Elizabeth II" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">Queen Elizabeth II</span>
    </a>
    <span style="white-space: pre-wrap;">&nbsp;in 1953. It remains in the&nbsp;</span>
    <a href="https://en.wikipedia.org/wiki/Royal_Collection" title="Royal Collection" class="ccm-editor-theme--link">
        <span style="white-space: pre-wrap;">Royal Collection</span>
    </a>
    <span style="white-space: pre-wrap;">.</span>
    <a href="https://en.wikipedia.org/wiki/Basket_of_Flowers_(Faberg%C3%A9_egg)#cite_note-royal-3" class="ccm-editor-theme--link">
        <sup style="white-space: pre-wrap;">
            <span class="ccm-editor-theme--textSuperscript">[2]</span>
        </sup>
    </a>
</p>
<p class="ccm-editor-theme--paragraph" dir="ltr" style="text-align: start;">
    <span style="white-space: pre-wrap;">The invoice issued by Fabergé in 1901 specifies: "Easter egg, white enamel. Basket with bouquet of wild flowers, with 4176 rose-cut diamonds and 10 pearls" (English translation). For years it was believed that the piece had no pearls and that they might have been connected with a possible surprise. However, in 2019, at the request of a Fabergé enthusiast, an examination of the object by the Royal Collection Trust staff proved that the egg originally had the ten pearls (in the centre of some flowers) mentioned in the invoice. There are now four pearls and six prongs (where there used to be pearls) surviving.</span>
    <a href="https://en.wikipedia.org/wiki/Basket_of_Flowers_(Faberg%C3%A9_egg)#cite_note-academia-5" class="ccm-editor-theme--link">
        <sup style="white-space: pre-wrap;">
            <span class="ccm-editor-theme--textSuperscript">[4]</span>
        </sup>
    </a>
</p>
`.replaceAll(/\>\s+</g, '><');

export default {
    title: 'Forms/Editor',
    component: Editor,
    argTypes: {}
}

export const defaultUsage = {
    args: {}
}
export const withState = () => ({
    components: {
        Editor,
        LexicalTreeViewPlugin
    },
    data: () => ({
        data: {},
        testHtml,
    }),
    template: `
        <Editor v-model="data" ref="editor" :html="testHtml" />
            
        <div style="clear:both">
            <code><pre>{{ data }}</pre></code>
        </div>
    `
})

export const withTreePlugin = () => ({
    components: {
        Editor,
        LexicalTreeViewPlugin
    },
    data: () => ({
        data: {},
        testHtml,
    }),
    template: `
        <Editor v-model="data" ref="editor" :html="testHtml">
            <LexicalTreeViewPlugin
                view-class-name="tree-view-output"
                tree-type-button-class-name="debug-treetype-button"
                time-travel-panel-class-name="debug-timetravel-panel"
                time-travel-button-class-name="debug-timetravel-button"
                time-travel-panel-slider-class-name="debug-timetravel-panel-slider"
                time-travel-panel-button-class-name="debug-timetravel-panel-button"
            />
        </Editor>
    `
})